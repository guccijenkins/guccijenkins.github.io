// This is your test secret API key.
const stripe = Stripe("pk_test_51Ql16dAgLF2qD5NrFV8oboSOc6ZkErr4BKz6PyKxrPRb6fSP9qOUVkttoM0gKxu9TREU6PflLkjcJ5oA4HJ5Mjry000HNDQtug");

initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}