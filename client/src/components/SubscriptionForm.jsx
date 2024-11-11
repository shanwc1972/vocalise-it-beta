import { useEffect, useState } from 'react'
import { GET_SUBSCRIPTION } from '../utils/queries'
import { useMutation, useLazyQuery } from '@apollo/client'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe('pk_test_51QIQqvGWmiETnCuZZqDBqNjU43S9XzkdZhW4olhJA0XVQ0nB2C8wODixTsRQvMW6Elji9dW6saaWEGIWdXQIjibL00sHEKo11z')


const SubscriptionForm = () => {
  const [subscriptionMonth, setSubscriptionMonth] = useState(1)
  const [subscribe, { data }] = useLazyQuery(GET_SUBSCRIPTION)
  
  const handleSubscribe = async (e) => {
    subscribe()
  }
   
  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.getSubscription.sessionId });
      })
    }
  }, [data])

  return (
    <div className="flex justify-center items-center h-screen">
      <button 
        onClick={handleSubscribe} 
        className="bg-purple-700 text-white py-2 px-4 rounded cursor-pointer text-xl transition duration-300 ease-in-out hover:bg-purple-900"
      >
        Subscribe
      </button>
    </div>
  )
}

export default SubscriptionForm
