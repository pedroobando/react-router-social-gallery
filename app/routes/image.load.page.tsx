import { imgtodata } from '~/.server/utils/imgtodata';
import type { Route } from './+types/image.load.page';

export async function loader({ request }: Route.LoaderArgs) {
  const imageUrl = 'https://picsum.photos/800/600';
  console.log(`[Navegador] Conectando a: ${imageUrl} para obtener la imagen...`);

  const imageResponse = await fetch(imageUrl);

  if (!imageResponse.ok) {
    throw new Response('No se pudo cargar la imagen desde la API.', { status: 500 });
  }

  // --- EL CAMBIO CLAVE ESTÁ AQUÍ ---
  // No tenemos `Buffer` en el navegador. En su lugar, leemos la respuesta como un `Blob`.
  // const imageBlob = await imageResponse.blob();

  // Usamos FileReader para convertir el Blob a un Data URI (Base64).
  // Lo envolvemos en una Promesa para poder usar async/await.
  // const imageDataUri = await new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.onloadend = () => resolve(reader.result as string);
  //   reader.onerror = reject;
  //   reader.readAsDataURL(imageBlob);
  // });

  // 3. Obtenemos el tipo de contenido (MIME type), ej: "image/jpeg".
  // const mimeType = imageResponse.headers.get('Content-Type');
  // if (!mimeType || !mimeType.startsWith('image/')) {
  //   throw new Response('La respuesta de la API no es una imagen válida.', { status: 500 });
  // }

  // 4. Leemos el cuerpo de la respuesta como datos binarios (ArrayBuffer).
  // const imageBuffer = await imageResponse.arrayBuffer();

  // 5. Convertimos los datos binarios a una cadena de texto en Base64.
  //    Node.js tiene la clase `Buffer` para manejar datos binarios.
  // const base64String = Buffer.from(imageBuffer).toString('base64');

  // 6. Creamos un "Data URI". Este es un formato que permite incrustar
  //    archivos (en este caso, la imagen) directamente en el código HTML/CSS.
  //    Formato: data:[<mime type>];base64,[<datos en base64>]
  // const imageDataUri = `data:${mimeType};base64,${base64String}`;

  // Retornamos el objeto. React Router lo pondrá a disposición del componente.
  // No necesitamos la función `json()` de Remix/Node aquí.
  return { imageDataUri: await imgtodata(imageResponse) };
}

export default function TestingPage({ loaderData }: Route.ComponentProps) {
  // `useLoaderData` ahora es importado desde 'react-router-dom'.
  // El tipado se puede hacer con `as { imageDataUri: string }` o herramientas más avanzadas.
  const { imageDataUri } = loaderData;
  // const { imageDataUri } = useLoaderData() as { imageDataUri: string };

  return (
    <div>
      <h2>Visualizador de Imagen desde API Externa</h2>
      <p>
        La siguiente imagen fue obtenida a través de un `loader` de React Router, convertida a Base64 en el navegador y
        renderizada.
      </p>

      <div style={{ marginTop: '2rem', border: '2px dashed #ccc', padding: '1rem' }}>
        <img
          src={imageDataUri}
          alt="Imagen cargada dinámicamente desde una API"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <details style={{ marginTop: '2rem' }}>
        <summary>Ver el Data URI generado (es muy largo)</summary>
        <code style={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>{imageDataUri}</code>
      </details>
    </div>
  );
}
