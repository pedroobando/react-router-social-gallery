export const imgtodata = async (imageResponse: Response) => {
  // 3. Obtenemos el tipo de contenido (MIME type), ej: "image/jpeg".
  const mimeType = imageResponse.headers.get('Content-Type');
  if (!mimeType || !mimeType.startsWith('image/')) {
    throw new Response('La respuesta de la API no es una imagen válida.', { status: 500 });
  }

  // 4. Leemos el cuerpo de la respuesta como datos binarios (ArrayBuffer).
  const imageBuffer = await imageResponse.arrayBuffer();

  // 5. Convertimos los datos binarios a una cadena de texto en Base64.
  //    Node.js tiene la clase `Buffer` para manejar datos binarios.
  const base64String = Buffer.from(imageBuffer).toString('base64');

  // 6. Creamos un "Data URI". Este es un formato que permite incrustar
  //    archivos (en este caso, la imagen) directamente en el código HTML/CSS.
  //    Formato: data:[<mime type>];base64,[<datos en base64>]
  const imageDataUri = `data:${mimeType};base64,${base64String}`;

  return imageDataUri;
};
