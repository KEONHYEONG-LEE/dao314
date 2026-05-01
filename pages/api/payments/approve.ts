import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { paymentId } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY; // .env.local에 저장된 API 키

  try {
    // Pi 서버에 결제 승인(Approve) 요청
    await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    );
    
    return res.status(200).json({ message: "Payment approved" });
  } catch (error: any) {
    console.error("Approve Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to approve payment" });
  }
}

