const cors = require("cors");
const express = require("express");
require("dotenv").config();

const stripe = require("stripe")("sk_test_51NQNTbSFkG3k55j6W0anPbdqvVsOWQeRJK9VdteSYoxVlakPfNX5bo3krBoWf8SlaODJPXmbBzivMrOMGwSzL2jX00HXs2Nlnu");

const app = express();

// Middlewares here
app.use(express.json());
app.use(cors());

// Routes here
app.get("/", (req, res) => {
  res.send("Stripe payment system");
});

// Listen
app.listen(8811, () => {
  console.log("Server started at port 8811");
});

app.post("/api/create-checkout-session", cors(), async (req, res) => {
  console.log("Request received");
  const { product } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.json({ id: session.id });
});