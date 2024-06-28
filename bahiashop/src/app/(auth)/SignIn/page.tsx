"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useGlobalContext } from "@/context/StoreProvider";

const defaultTheme = createTheme();
const backgroundImage = "/Signin.webp";

export default function SignInSide() {
  const { setSearch } = useGlobalContext();
  const router = useRouter();
  const { data: session } = useSession();

  const [formErrors, setFormErrors] = React.useState({
    email: "",
    password: "",
    credentialsError: "", // Nuevo campo de error para credenciales incorrectas
  });

  const initialFormData = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = React.useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() ? "" : `Por favor, ingrese su ${name}.`,
      credentialsError: "", // Limpiar el error de credenciales al cambiar cualquier campo
    }));
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación de campos
    let valid = true;
    const newErrors = { email: "", password: "", credentialsError: "" };
    if (!formData.email) {
      newErrors.email = "Por favor, ingrese su correo electrónico.";
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = "Por favor, ingrese su contraseña.";
      valid = false;
    }

    if (valid) {
      const response = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log({ response });
      if (!response?.error) {
        router.push("/");
        router.refresh();
      } else {
        // Marcar error de credenciales incorrectas
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          credentialsError: "Nombre de usuario o contraseña incorrectos.",
        }));
        setFormData(initialFormData); // Vaciar los campos del formulario
      }
    } else {
      setFormErrors(newErrors);
    }
  };

  React.useEffect(() => {
    setSearch("");
  });

  React.useEffect(() => {
    if (session) {
      router.push("/");
      router.refresh();
    }
  }, [session, router]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar Sesión
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar Sesión
              </Button>
              {formErrors.credentialsError && (
                <Typography variant="body2" color="error" align="center">
                  {formErrors.credentialsError}
                </Typography>
              )}
              <Grid container>
                <Grid item sx={{ marginTop: 2 }}>
                  <Link href="/SignUp" variant="body2">
                    {"¿No tienes una cuenta? Regístrate aquí"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
