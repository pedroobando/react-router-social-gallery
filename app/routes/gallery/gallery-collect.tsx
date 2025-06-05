import React from 'react';
import type { Route } from './+types/gallery-collect';
import { sleep } from '~/lib/sleep';

const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { collectId } = params;

  await sleep(500);

  return {
    collectId,
  };
};

const GalleryCollect = ({ params }: Route.ComponentProps) => {
  const { collectId } = params;

  return (
    <section className="p-4">
      <h2 className="text-2xl mb-2">Gallery {collectId.toUpperCase()}</h2>
      <p className="">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem eius exercitationem tenetur
        ipsum ducimus. Deleniti, non. Repudiandae provident animi amet illo reiciendis, accusamus
        cum magni repellendus, aperiam, tempore labore officia.
      </p>

      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam voluptas consectetur quisquam
        deleniti molestias. Minima, voluptatem debitis animi dolor quae accusamus exercitationem
        expedita nisi nulla laudantium nobis dignissimos asperiores numquam?
      </p>
    </section>
  );
};

export default GalleryCollect;
