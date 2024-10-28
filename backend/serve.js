const express = require("express");
const session = require('express-session');
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const puerto = 3030;

const corsOptions = {
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
};

app.use(cors(corsOptions));
app.use(express.json());

// Configuración de la sesión
app.use(session({
  secret: 'tu-clave-secreta', // Cambia esto por una clave fuerte
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si usas https
}));


const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "3521321522",
  database: "Presidencia",
  port: 3306
};

// Conexión a la base de datos
const connectDB = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Conectado a la base de datos MySQL");
    return connection;
  } catch (err) {
    console.error("Error conectando a la base de datos:", err);
  }
};

// Ruta de prueba
app.get("/", (req, res) => {
  res.send(
    "Servidor funcionando correctamente. Usa /api/registros para las solicitudes POST y GET."
  );
});

// Ruta para obtener la información del usuario actual
app.get("/api/user-info", (req, res) => {
  if (req.session.id_usuario && req.session.nombre) {
    res.json({ id_usuario: req.session.id_usuario, nombre: req.session.nombre });
  } else {
    res.status(401).json({ error: "No hay sesión activa" });
  }
});

// Ruta para crear un nuevo registro
app.post("/api/registros", async (req, res) => {
  const connection = await connectDB();
  const {
    id_usuario,
    creado_por_nombre,
    Fecha,
    Nombre,
    Domicilio_Calle,
    Colonia_Comunidad,
    Seccion,
    Contacto,
    TipoDeApoyo,
    Descripcion_Apoyo,
    Status,
    Monto_Autorizado,
    Otro_Tipo_De_Ayuda,
    Turnado_A,
    Historial,
    Nube,
    Observaciones,
  } = req.body;

  try {
    // Obtener el último número de registro
    const [lastRegistro] = await connection.execute('SELECT MAX(Registro) as lastRegistro FROM apoyos');
    const nuevoRegistro = (lastRegistro[0].lastRegistro || 0) + 1;

    const query = `INSERT INTO apoyos (Registro, id_usuario, creado_por_nombre, Fecha, Nombre, Domicilio_Calle,
                   Colonia_Comunidad, Seccion, Contacto, TipoDeApoyo, Descripcion_Apoyo,
                   Status, Monto_Autorizado, Otro_Tipo_De_Ayuda, Turnado_A, Historial, Nube, Observaciones) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await connection.execute(query, [
      nuevoRegistro,
      id_usuario,
      creado_por_nombre,
      Fecha,
      Nombre,
      Domicilio_Calle,
      Colonia_Comunidad,
      Seccion,
      Contacto,
      TipoDeApoyo,
      Descripcion_Apoyo,
      Status,
      Monto_Autorizado,
      Otro_Tipo_De_Ayuda,
      Turnado_A,
      Historial,
      Nube,
      Observaciones,
    ]);

    res.status(201).json({ message: "Registro guardado exitosamente", id: result.insertId, registro: nuevoRegistro });
  } catch (err) {
    console.error("Error al insertar registro:", err);
    res.status(500).json({ error: "Error al guardar el registro" });
  } finally {
    await connection.end();
  }
});


// Nueva ruta para verificar duplicados
app.get("/api/registros/validate", async (req, res) => {
  const connection = await connectDB();
  const { Domicilio_Calle, Colonia_Comunidad, Registro } = req.query;

  // Normaliza las entradas para la comparación
  const normalizedCalle = Domicilio_Calle.toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
  const normalizedColonia = Colonia_Comunidad.toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

  const query = `SELECT COUNT(*) AS count FROM apoyos 
                   WHERE (LOWER(TRIM(REPLACE(Domicilio_Calle, ' ', ' '))) = ? 
                   AND LOWER(TRIM(REPLACE(Colonia_Comunidad, ' ', ' '))) = ?) 
                   OR (Registro = ?)`;

  try {
    const [results] = await connection.execute(query, [
      normalizedCalle,
      normalizedColonia,
      Registro,
    ]);
    const exists = results[0].count > 0;
    res.status(200).json({ exists });
  } catch (err) {
    console.error("Error al verificar registro:", err);
    res.status(500).json({ error: "Error al verificar el registro" });
  } finally {
    await connection.end();
  }
});

// Nueva ruta GET para obtener todos los registros
app.get("/api/registros", async (req, res) => {
  const connection = await connectDB();
  const query = "SELECT * FROM apoyos";

  try {
    const [rows] = await connection.execute(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error al obtener registros:", err);
    res.status(500).json({ error: "Error al obtener los registros" });
  } finally {
    await connection.end();
  }
});

// Ruta para eliminar un registro
app.delete("/api/registros/:id", async (req, res) => {
  const connection = await connectDB();
  const registroId = req.params.id;
  const query = "DELETE FROM apoyos WHERE Registro = ?";

  try {
    const [result] = await connection.execute(query, [registroId]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Registro no encontrado" });
      return;
    }
    res.status(200).json({ message: "Registro eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar registro:", err);
    res.status(500).json({ error: "Error al eliminar el registro" });
  } finally {
    await connection.end();
  }
});

//ruta para editar los registros de la tabla apoyos

app.put("/api/registros/:id", async (req, res) => {
  const connection = await connectDB();

  // Obtén el id_usuario de la sesión
  const id_usuario = req.session.id_usuario; 

  if (!id_usuario) {
    return res.status(401).json({ error: "No estás autenticado" });
  }

  // Verifica el cuerpo de la solicitud
  console.log(req.body); // Verifica los datos que llegan en la solicitud

  const {
    Fecha,
    Nombre,
    Domicilio_Calle,
    Colonia_Comunidad,
    Seccion,
    Contacto,
    TipoDeApoyo,
    Descripcion_Apoyo,
    Status,
    Monto_Autorizado,
    Turnado_A,
    Historial,
    Nube,
    Observaciones,
  } = req.body;

  const fechaFormateada = new Date(Fecha).toISOString().split("T")[0];

  const query = `UPDATE apoyos SET  
                Fecha = ?, 
                Nombre = ?, 
                Domicilio_Calle = ?, 
                Colonia_Comunidad = ?,
                Seccion = ?, 
                Contacto = ?, 
                TipoDeApoyo = ?, 
                Descripcion_Apoyo = ?, 
                Status = ?,
                Monto_Autorizado = ?, 
                Turnado_A = ?, 
                Historial = ?, 
                Nube = ?, 
                Observaciones = ?,
                actualizado_por_nombre = ?
                WHERE Registro = ?`;

  try {
    const [result] = await connection.execute(query, [
      fechaFormateada,
      Nombre,
      Domicilio_Calle,
      Colonia_Comunidad,
      Seccion,
      Contacto,
      TipoDeApoyo,
      Descripcion_Apoyo,
      Status,
      Monto_Autorizado,
      Turnado_A,
      Historial,
      Nube,
      Observaciones,
      id_usuario,
    ]);

    console.log(`Affected rows: ${result.affectedRows}`); 

    if (result.affectedRows === 0) {
      res.status(404).json({ error: `Registro con ID ${id_usuario} no encontrado` });
      return;
    }
    
    res.status(200).json({ message: "Registro actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar el registro:", err);
    res.status(500).json({ error: "Error al actualizar el registro" });
  } finally {
    await connection.end();
  }
});

// Ruta para obtener los apoyos del usuario autenticado
app.get("/api/registros", async (req, res) => {
  // Obtener el id_usuario de la sesión
  const id_usuario = req.session.id_usuario; // Accediendo al id_usuario desde la sesión

  if (!id_usuario) {
    return res
      .status(401)
      .json({ error: "No estás autenticado. Se requiere inicio de sesión." });
  }

  const connection = await connectDB();
  const query = "SELECT * FROM apoyos WHERE id_usuario = ?";

  try {
    const [rows] = await connection.execute(query, [id_usuario]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error al obtener registros del usuario:", err);
    res.status(500).json({ error: "Error al obtener los registros del usuario" });
  } finally {
    await connection.end();
  }
});


// Ruta para obtener gastos agrupados para la gráfica
app.get("/api/gastos", async (req, res) => {
  const connection = await connectDB();
  const query = `
        SELECT 
            Seccion,
            SUM(Monto_Autorizado) AS Total,
            DATE_FORMAT(Fecha, '%Y-%m') AS Mes
        FROM 
            apoyos
        GROUP BY 
            Seccion, Mes
        ORDER BY 
            Seccion, Mes
    `;

  try {
    const [rows] = await connection.execute(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error al obtener gastos agrupados:", err);
    res.status(500).json({ error: "Error al obtener los gastos agrupados" });
  } finally {
    await connection.end();
  }
});

// Ruta para registrar nuevos usuarios
app.post("/api/registro_usuarios", async (req, res) => {
  const connection = await connectDB();
  const { nombre, telefono, rol, codigo_acceso } = req.body; // Cambié `correo` a `telefono`

  // Verificar si el teléfono ya existe
  const phoneCheckQuery = "SELECT * FROM usuarios WHERE telefono = ?"; // Consulta actualizada
  const [existingUser] = await connection.execute(phoneCheckQuery, [telefono]);
  if (existingUser.length > 0) {
    return res.status(400).json({ error: "El teléfono ya está registrado." });
  }

  let userId = null;

  // Inserción en la tabla usuarios
  const insertQuery = `INSERT INTO usuarios (id_usuario, nombre, telefono, codigo_acceso, rol) 
                       VALUES (?, ?, ?, ?, ?)`; // Cambié `correo` a `telefono`
  try {
    const [result] = await connection.execute(insertQuery, [
      userId,
      nombre,
      telefono, // Cambié `correo` a `telefono`
      codigo_acceso,
      rol,
    ]);
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      codigo_acceso: codigo_acceso,
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ error: "Error al registrar el usuario" });
  } finally {
    await connection.end();
  }
});


// Ruta para obtener todos los usuarios registrados
app.get("/api/registro_usuarios", async (req, res) => {
  const connection = await connectDB();

  try {
    // Consulta para obtener todos los usuarios
    const [rows] = await connection.execute("SELECT * FROM usuarios");
    console.log("Usuarios obtenidos:", rows); // Verifica qué datos se obtienen
    res.status(200).json(rows); // Devolver los usuarios en formato JSON
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  } finally {
    await connection.end();
  }
});

// Ruta para actualizar un usuario registrado
app.put("/api/registro_usuarios/:id", async (req, res) => {
  const connection = await connectDB();
  const userId = req.params.id;
  const { nombre, correo, codigo_acceso } = req.body;

  try {
    // Consulta para actualizar el usuario
    const [result] = await connection.execute(
      "UPDATE usuarios SET nombre = ?, correo = ?, codigo_acceso = ? WHERE id_usuario = ?",
      [nombre, correo, codigo_acceso, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  } finally {
    await connection.end();
  }
});

app.get("/api/registro_usuarios", async (req, res) => {
  const connection = await connectDB();

  try {
    const [rows] = await connection.execute("SELECT * FROM usuarios WHERE activo = 1");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios activos:", error);
    res.status(500).json({ error: "Error al obtener usuarios activos" });
  } finally {
    await connection.end();
  }
});


// Ruta para iniciar sesión
app.post("/api/login", async (req, res) => {
  const connection = await connectDB();
  const { nombre, codigoAcceso } = req.body;

  try {
    // Consulta para verificar si el usuario existe con el nombre y código de acceso proporcionados
    const query =
      "SELECT * FROM usuarios WHERE nombre = ? AND codigo_acceso = ?";
    const [rows] = await connection.execute(query, [nombre, codigoAcceso]);

    if (rows.length === 0) {
      // Si no se encuentra un usuario con esos datos, devuelve un error
      return res.status(401).json({
        success: false,
        message: "Nombre o código de acceso inválido",
      });
    }

    // Si se encuentra el usuario, guarda el id_usuario en la sesión
    const user = rows[0];
    req.session.id_usuario = user.id_usuario; // Almacena el id_usuario en la sesión
    req.session.nombre = user.nombre; 

    res.status(200).json({ success: true, message: "Sesión iniciada", user });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ success: false, message: "Error al iniciar sesión" });
  } finally {
    await connection.end();
  }
});



// Iniciar el servidor
app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
