const form = document.getElementById("feedbackForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;

    try {
        const response = await fetch("/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, rating, comment })
        });

        if (!response.ok) throw new Error("Request failed");

        form.reset();

        // Save hone ke baad feedback wale page par bhejo
        window.location.href = "feedback.html";
    } catch (error) {
        alert("Something went wrong. Please try again.");
    }
});