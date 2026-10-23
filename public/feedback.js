const listEl = document.getElementById("feedbackList");
const stateEl = document.getElementById("state");
const searchInput = document.getElementById("searchInput");
const ratingFilter = document.getElementById("ratingFilter");

const LABELS = { 1: "Poor", 2: "Average", 3: "Good", 4: "Very Good", 5: "Excellent" };

let allFeedback = [];

// Special characters ko safe banata hai
function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

// MongoDB _id ke andar date chhupi hoti hai
function dateFromId(id) {
    const ts = parseInt(String(id).substring(0, 8), 16) * 1000;
    return new Date(ts).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function starsHtml(rating) {
    const r = Math.max(0, Math.min(5, Number(rating) || 0));
    return "★".repeat(r) + `<span class="off">${"★".repeat(5 - r)}</span>`;
}

function setState(title, message, isError = false) {
    stateEl.className = "state" + (isError ? " error" : "");
    stateEl.innerHTML = title ? `<strong>${esc(title)}</strong>${esc(message)}` : "";
}

function updateStats(items) {
    const total = items.length;
    const sum = items.reduce((acc, i) => acc + (Number(i.rating) || 0), 0);
    document.getElementById("statTotal").textContent = total;
    document.getElementById("statAvg").textContent = total ? (sum / total).toFixed(1) : "0.0";
    document.getElementById("statTop").textContent = items.filter((i) => Number(i.rating) === 5).length;
}

function render() {
    const query = searchInput.value.trim().toLowerCase();
    const rating = ratingFilter.value;

    const filtered = allFeedback.filter((item) => {
        const comment = item.comment ?? item.message ?? "";
        const matchesText =
            !query ||
            String(item.name ?? "").toLowerCase().includes(query) ||
            String(comment).toLowerCase().includes(query);
        const matchesRating = rating === "all" || String(item.rating) === rating;
        return matchesText && matchesRating;
    });

    listEl.innerHTML = filtered
        .map((item) => {
            const name = item.name || "Anonymous";
            const comment = item.comment ?? item.message ?? "";
            const r = Number(item.rating) || 0;
            return `
                <article class="card">
                    <div class="card-head">
                        <div class="avatar">${esc(name.charAt(0).toUpperCase())}</div>
                        <div class="who">
                            <h3>${esc(name)}</h3>
                            <span>${dateFromId(item._id)}</span>
                        </div>
                    </div>
                    <div class="rating-row">
                        <span class="stars" aria-label="${r} out of 5">${starsHtml(r)}</span>
                        <span class="badge r${r}">${LABELS[r] || ""}</span>
                    </div>
                    <p class="comment">${esc(comment) || "No comment provided."}</p>
                </article>
            `;
        })
        .join("");

    if (allFeedback.length === 0) {
        setState("No feedback yet", "Be the first to share your thoughts.");
    } else if (filtered.length === 0) {
        setState("No matching feedback", "Try a different search or rating filter.");
    } else {
        setState("");
    }
}

async function loadFeedback() {
    setState("Loading feedback...", "Please wait a moment.");
    try {
        const res = await fetch("/feedback");
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();

        // Sabse naya feedback sabse upar
        allFeedback = data.sort((a, b) => String(b._id).localeCompare(String(a._id)));

        updateStats(allFeedback);
        render();
    } catch (err) {
        console.error("Error loading feedback:", err);
        setState("Could not load feedback", "Please check that the server is running and try again.", true);
    }
}

searchInput.addEventListener("input", render);
ratingFilter.addEventListener("change", render);

loadFeedback();