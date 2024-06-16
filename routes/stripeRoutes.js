
const router = require("express").Router();
const Stripe = require("stripe")

require('dotenv').config();

const stripe = Stripe('sk_test_51PKo3M097Htwic2go0imvKbmisaJA3rj2uIR9Yumvi1t7nprNpvPGkoK94QCiKCAVFBmiIuwFZewxXfQvgpfdyU300ENgbhq3K');

require("dotenv").config();

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Le montant de votre commande est de :',
          },
          unit_amount: req.body.price_data_amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:8080/success/',
    cancel_url: 'http://localhost:8080/cancel',
  });

  res.send({url: session.url});
});

module.exports = router;