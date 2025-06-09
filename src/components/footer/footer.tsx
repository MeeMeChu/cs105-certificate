"use client";

import { FC } from "react";
import {
  Box,
  Container,
  Divider,
  Grid2 as Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import packageJson from "@/package.json";
import { useApp } from "@context/app-context";

const Footer: FC = () => {
  const appContext = useApp();
  if (!appContext) return null;
  const { mode } = appContext;

  return (
    <Box>
      <Divider sx={{ mt: 4 }} />
      <Container sx={{ py: 4 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack direction="column">
              {/* <Image
                src="/svgs/logo.svg"
                alt="logo"
                width={64}
                height={64}
              /> */}
              <Typography>Contact</Typography>
              <Box sx={{ display: "flex" }}>
                <Link href={"https://www.facebook.com/profile.php?id=100026420958163"} target="_blank">
                  <IconButton>
                    {mode === "dark" ? (
                      <Image
                        src="/svgs/facebook-light.svg"
                        alt="discord-light"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <Image
                        src="/svgs/facebook-dark.svg"
                        alt="discord-dark"
                        width={32}
                        height={32}
                      />
                    )}
                  </IconButton>
                </Link>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <Typography variant="caption" color="primary">{packageJson.version}</Typography>
        <Typography variant="caption"> © 2025 CS Event | ชุมนุมคอมพิวเตอร์ Science.PSU </Typography>
      </Container>
    </Box>
  );
};

export default Footer;