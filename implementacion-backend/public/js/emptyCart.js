document.addEventListener("DOMContentLoaded", async () => {
    const emptyButton = document.getElementById("emptyButton")

    if (emptyButton) {
        emptyButton.addEventListener("click", async () => {
            try {
                const response = await fetch('/api/sessions/cartId');
                const data = await response.json();
                const cartId = data.userCartId;

                const emptyCartResponse = await fetch(`/api/carts/empty/${cartId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (emptyCartResponse.ok) {
                    alert("empty successful");
                    return window.location.reload()
                } else {
                    const errorData = await emptyCartResponse.json();
                    console.error("Failed to process empty", errorData);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
    }

})