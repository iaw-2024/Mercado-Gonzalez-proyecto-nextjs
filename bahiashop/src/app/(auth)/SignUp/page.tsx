"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useGlobalContext } from "@/context/StoreProvider";
import { useSession } from "next-auth/react";


function SignUp() {
  const router = useRouter();
  const { data: session } = useSession();
  const { addUser, setSearch } = useGlobalContext();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contraseña: "",
  });
  const [formErrors, setFormErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contraseña: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let valid = true;
    const newErrors = { ...formErrors };

    // Validación de campos
    if (!formData.nombre.trim()) {
      newErrors.nombre = "Por favor, ingrese su nombre.";
      valid = false;
    }
    if (!formData.apellido.trim()) {
      newErrors.apellido = "Por favor, ingrese su apellido.";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Por favor, ingrese su correo electrónico.";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Ingrese un correo electrónico válido.";
      valid = false;
    }
    if (!formData.contraseña.trim()) {
      newErrors.contraseña = "Por favor, ingrese su contraseña.";
      valid = false;
    } else if (formData.contraseña.length < 6) {
      newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres.";
      valid = false;
    }

    if (valid) {
      // Agregar la propiedad password al objeto formData
      const userWithPassword = { ...formData, password: formData.contraseña };

      try {
        await addUser(userWithPassword); // Usar el objeto actualizado con la propiedad password
        setFormSubmitted(true);
        setTimeout(() => {
          router.push("/SignIn");
          router.refresh();
        }, 5000);
      } catch (error) {
        console.error("Error al registrar el usuario:", error);
        alert("Error al registrar el usuario");
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
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registrar cuenta
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="nombre"
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre"
                  autoFocus
                  error={Boolean(formErrors.nombre)}
                  helperText={formErrors.nombre}
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="apellido"
                  label="Apellido"
                  name="apellido"
                  autoComplete="family-name"
                  error={Boolean(formErrors.apellido)}
                  helperText={formErrors.apellido}
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email}
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="contraseña"
                  label="Contraseña"
                  type="password"
                  id="contraseña"
                  autoComplete="new-password"
                  error={Boolean(formErrors.contraseña)}
                  helperText={formErrors.contraseña}
                  value={formData.contraseña}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrarse
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/SignIn" variant="body2">
                  ¿Ya tienes una cuenta? Iniciar sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
