import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. HTTP 메서드 검증
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { paymentId } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;

  // 2. 필수 데이터 및 환경변수 검증
  if (!paymentId) {
    return res.status(400).json({ error: 'Missing paymentId in request body' });
  }

  if (!PI_API_KEY) {
    console.error('PI_API_KEY is not configured in environment variables.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 3. Pi Platform API로 승인(Approve) 요청
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 타임아웃 10초 설정
      }
    );

    return res.status(200).json({ 
      message: 'Payment approved successfully',
      data: response.data 
    });
  } catch (error: any) {
    const errorDetails = error.response?.data || error.message;
    console.error('Approve Payment Error:', errorDetails);

    return res.status(error.response?.status || 500).json({
      error: 'Failed to approve payment',
      details: errorDetails,
    });
  }
}
