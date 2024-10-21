export const handleError = (res, error, message = "Error del servidor") => {
    console.error("Ocurrió un error:", error);
    res.status(500).json({
        ok: false,
        msg: message,
    });
};
