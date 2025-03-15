// This is your test secret API key.
const stripe = require('stripe')('sk_test_51Ql16dAgLF2qD5NrppdWyqILJctHV7ejPJOivJNffp89IrVdc1D6k4LZVYpdoUh5oAAQMfs79Y66Ik4pJrtp9xCU00ZGkdmCYQ');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'https://guccijenkins.github.io/Stripe_Checkout_Pages.checkout.html/';

app.post('/create-checkout-session', async (req, res) => {
  const stripe = require('stripe')('sk_test_51Ql16dAgLF2qD5NrppdWyqILJctHV7ejPJOivJNffp89IrVdc1D6k4LZVYpdoUh5oAAQMfs79Y66Ik4pJrtp9xCU00ZGkdmCYQ');

  const taxRate = await stripe.taxRates.create({
    display_name: 'Sales Tax',
    inclusive: false,
    percentage: 7.25,
    country: 'US',
    state: 'CA',
    jurisdiction: 'US - CA',
    description: 'CA Sales Tax',
  });

  const shippingRate = await stripe.shippingRates.create({
    display_name: 'Ground Shipping',
    type: 'fixed_amount',
    fixed_amount: {
      amount: 500,
      currency: 'usd',
    },
    delivery_estimate: {
      minimum: {
        unit: 'business_day',
        value: 5,
      },
      maximum: {
        unit: 'business_day',
        value: 7,
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'required',
       
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [{ shipping_rate: shippingRate.id }], // Use the created shipping rate
      line_items: [
        
        {        
        price_data: {
          currency: 'usd',
          product_data: {
            
            name: 'Sticker',
            description: 'poopopoppopo',
            images: ['https:\/\/images-api.printify.com\/mockup\/679520af3dc3a484a30680e9\/72006\/13462\/fighter-jet-die-cut-stickers.jpg?camera_label=front'],
          },
          unit_amount: 400, 
          tax_behavior: 'exclusive',
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 99,
        },
        quantity: 1,
        tax_rates: [taxRate.id], // Apply the tax rate to this item
        
      },
    ],
    
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: 'http://localhost:4242/return.html',
  });

  res.send({clientSecret: session.client_secret});
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.listen(4242, () => console.log('Running on port 4242'));