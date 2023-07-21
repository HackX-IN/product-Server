const router = require('express').Router();

const stripe = require('stripe')('sk_test_51NWA8ESHvAOA443JJX0eJlMKUzqXnJ1YD6ZYQbsUH9wkV2Hr3gFCqf95UifHdLWUgjdSdCfOPkQEEDnLveJU1BN400cpKUh81T');

router.post('/intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});




module.exports = router;