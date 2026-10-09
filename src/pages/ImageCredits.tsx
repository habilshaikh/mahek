import { DemoNotice, PageHero, usePageMeta } from '../components/ui/primitives';
import { photoCredits } from '../data/images';

export default function ImageCredits() {
  usePageMeta('Image Credits', 'Licensing and attribution for photography used on this site.');
  return (
    <>
      <PageHero eyebrow="Legal & Support" title="Image credits" text="Attribution for the openly licensed photography used across this demo storefront." crumbs={[{ label: 'Image credits' }]} />
      <section className="container-lux py-16">
        <DemoNotice className="mb-10 max-w-3xl">
          Product images are illustrative renders of sample products, generated for this prototype. Atmosphere and ingredient photography is openly licensed stock
          (CC0, Public Domain or CC BY) and has been resized, cropped, colour-graded and composited. It does not depict Mahek Perfume’s own products, boutiques or
          history. Replace with the brand’s own photography before launch.
        </DemoNotice>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photoCredits.map((c) => (
            <li key={c.file} className="card-lux flex min-w-0 gap-4 p-3">
              <img src={c.file} alt="" loading="lazy" decoding="async" width={96} height={72} className="h-[72px] w-24 shrink-0 object-cover" />
              <div className="min-w-0 text-xs leading-5">
                <p className="truncate font-serif text-base text-ivory">{c.title}</p>
                <p className="text-muted">
                  by{' '}
                  {c.creatorUrl ? (
                    <a href={c.creatorUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                      {c.creator}
                    </a>
                  ) : (
                    c.creator
                  )}
                </p>
                <p className="text-muted">
                  {c.licenseUrl ? (
                    <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                      {c.license}
                    </a>
                  ) : (
                    c.license
                  )}
                  {c.sourceUrl && (
                    <>
                      {' · '}
                      <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                        Source
                      </a>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
