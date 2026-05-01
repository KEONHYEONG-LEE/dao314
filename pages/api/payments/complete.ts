import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { paymentId, txid } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;

  try {
    // Pi 서버에 결제 완료(Complete) 요청
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      { txid },
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    );
    
    return res.status(200).json({ message: "Payment completed", data: response.data });
  } catch (error: any) {
    console.error("Complete Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to complete payment" });
  }
}

