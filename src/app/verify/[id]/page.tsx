import dayjs from 'dayjs';
import { Box, Container, Typography } from '@mui/material';
import Image from "next/image";

import { api } from '@lib/axios-config';
import { Registration } from '@type/registration';

// Async function to fetch event data based on the `id`
async function getData(id: string): Promise<Registration | null> {
  try {
    const res = await api.get(`/verify/${id}`);
    return res.data.registration; // Adjusting to access the registration object from the response
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Server-side fetching of data in the component
const QRCodeConfirmation = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Fetch registration details using the getData function
  const registrationDetail = await getData(id);

  // If no registration detail is found, return an error message
  if (!registrationDetail) {
    return (
      <Container maxWidth="xl" className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <Typography variant="h6" color="error" className="text-white">
          Failed to load event details
        </Typography>
      </Container>
    );
  }

  // Mock participant data based on the registration details
  const participant = {
    name: `${registrationDetail.firstName} ${registrationDetail.lastName}`,
    date: dayjs(registrationDetail.registrationDate).format("DD/MM/YYYY"),
  };

  return (
    <Container
      maxWidth="xl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: '0px 8px 24px rgba(149, 157, 165, 0.3)',
          width: 500,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.9)',
        }}
        className="shadow-2xl"
      >
          <div className="flex justify-center mb-2">
          <Image
            src="/svgs/logo.svg"
            alt="logo"
            width={128}
            height={128}
          />
        </div>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }} className="text-indigo-900">
          แบบยืนยันการเข้าร่วมกิจกรรม
        </Typography>
        <Box>
          <Typography sx={{ mt: 2 }} className="text-gray-700">
            ชื่อกิจกรรม : <strong>{registrationDetail?.event?.title}</strong>
          </Typography>
          <Typography className="text-gray-700">
            ชื่อผู้เข้าร่วม: <strong>{participant.name}</strong>
          </Typography>
          <Typography className="text-gray-700">
            วันที่ได้เข้าร่วม: <strong>{participant.date}</strong>
          </Typography>
          <Typography className="text-gray-700">
            โรงเรียน: <strong>{registrationDetail.schoolName}</strong>
          </Typography>
          <Typography className="text-gray-700">
            ชั้นปี: <strong>{registrationDetail.year}</strong>
          </Typography>
          <Typography className="text-gray-700">
            Email: <strong>{registrationDetail.email}</strong>
          </Typography>
          <Typography className="text-gray-700">
            สถานที่จัดกิจกรรม: <strong>{registrationDetail?.event?.location}</strong>
          </Typography>
          <Typography className="text-gray-700">
            วันที่จัดกิจกรรม: <strong>{dayjs(registrationDetail?.event?.startDate).format("DD/MM/YYYY")}</strong>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default QRCodeConfirmation;
