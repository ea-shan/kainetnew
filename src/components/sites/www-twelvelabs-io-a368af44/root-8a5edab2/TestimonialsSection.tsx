import { testimonials } from "./content";

export function TestimonialsSection() {
  const loop = [...testimonials, ...testimonials];

  return (
    <section
      className="w-full overflow-hidden py-20 text-[#000000]"
      style={{
        background: "linear-gradient(90deg, #CECFF7 0%, #EEEEEE 48%, #E6BEC6 100%)",
      }}
    >
      <h2 className="px-5 text-center text-[36px] leading-[1.14] tracking-[-0.02em] md:text-[48px] md:leading-[54.72px] md:tracking-[-0.96px]">
        Customer Stories
      </h2>

      <div className="tl-stories-marquee mt-14">
        <div className="tl-stories-track">
          {loop.map((item, i) => (
            <article
              key={`${item.name}-${i}`}
              className="flex min-h-[340px] w-[min(560px,85vw)] shrink-0 flex-col rounded-[40px] bg-white/60 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md md:min-h-[400px] md:rounded-[56px] md:p-12"
            >
              <p className="text-[18px] leading-7 tracking-[0.1px] md:text-[20px]">“{item.quote}”</p>
              <p className="mt-auto pt-10 text-[12px] uppercase tracking-[0.08em] text-[#000000]/55">
                {item.name} {item.role}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
