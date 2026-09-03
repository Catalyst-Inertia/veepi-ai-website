import { ProjectModels } from '@/models/project'
import Image from 'next/image'
import s from './index.module.scss'

export default function PortfolioCard({
  project,
  className,
}: {
  project: ProjectModels
  className?: string
}) {
  return (
    <>
      <div
        className={`w-full min-w-0 flex flex-wrap px-4 py-6 lg:p-6 ${s.container} ${className ?? ''}`}
      >
        <div className="flex flex-wrap w-full">
          <div className="w-full mb-6">
            <h4 className="mb-4">{project.title}</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((item, index) => (
                <p
                  key={index}
                  className="small-paragraph border border-primary_color py-1 px-4 rounded-full h-7"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="h-[158px] md:h-[313px] w-full self-end relative rounded-lg md:rounded-2xl">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill={true}
              sizes="(min-width: 1024px) 500px, 315px"
              className="object-cover w-full rounded-lg md:rounded-2xl"
            />
          </div>
        </div>
      </div>
    </>
  )
}
