import { useState, useEffect, useRef, useCallback } from 'react';
import { ExternalLink, ArrowDown } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  video?: string;
  videos?: string[];
  aspectRatio?: string;
  tags: string[];
  link?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'PALMERA',
    description: 'An AI-powered SaaS platform that allows users to build and deploy applications through natural language. Designed and built a complete multi-agent AI development ecosystem, including autonomous AI agents, custom compiler, real-time streaming infrastructure and cloud deployment pipeline. Built end-to-end: AI app builder & compiler (DSL → React/Vite/Tailwind), FastAPI backend with PostgreSQL, Redis & Celery, real-time SSE streaming architecture, cloud infrastructure & serverless execution, React web app + SwiftUI iOS application.',
    image: '/palmera.webp',
    videos: ['/palmera.mp4', '/img0984.mov'],
    aspectRatio: 'aspect-[944/2048]',
    tags: ['React', 'SwiftUI', 'FastAPI', 'PostgreSQL', 'Redis', 'Cloud Run', 'Anthropic', 'Stripe'],
    link: '#',
  },
  {
    id: 2,
    title: 'CHN',
    description: 'A premium real estate platform for the Israeli market, featuring interactive map-based search, real-time listing updates, and advanced filtering. Engineered with a complete property management dashboard, light and dark theme modes, and responsive map layout.',
    image: '/chn-1.png',
    images: ['/chn-1.png', '/chn-2.png', '/chn-3.png'],
    tags: ['React', 'TypeScript', 'Tailwind', 'Google Maps', 'Express', 'PostgreSQL'],
    link: '#',
  },
  {
    id: 3,
    title: 'AI Fraud Detection (Work in Progress)',
    description: 'Building a computer vision platform for fraud detection. Current prototype demonstrates real-time banknote detection using a custom YOLO model, serving as a foundation for broader fraud-analysis workflows.',
    video: '/data-viz.mov',
    tags: ['YOLO', 'OpenCV', 'PyTorch', 'Python'],
    link: '#',
  },
  {
    id: 4,
    title: 'CHITOSE - Food Delivery app (2019-2021) (Outdated)',
    description: 'Founded and built a local food delivery marketplace, connecting restaurants and customers through a digital ordering platform. Led the product journey from idea to operation, combining technology, user experience, and real-world business execution.',
    video: '/project4.mov',
    tags: ['Mobile App', 'Real-time Orders', 'Database'],
    link: '#',
  },
];

export default function Home() {
  const [currentProject, setCurrentProject] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTransitioningRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);

  const totalSections = projects.length + 2; // Hero + Projects + Footer

  const navigateToSection = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current as any);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    }, 500) as any;

    setCurrentProject((prev) => {
      if (direction === 'next') {
        // Don't loop back to start, stop at last section
        return Math.min(prev + 1, totalSections - 1);
      } else {
        // Don't go below first section
        return Math.max(prev - 1, 0);
      }
    });
  }, [totalSections]);

  const goToSection = useCallback((idx: number) => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCurrentProject(idx);

    setTimeout(() => {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    }, 800);
  }, []);

  // Reset animation key to trigger re-animation on section change
  const animationKey = currentProject;

  const handleWheel = useCallback((e: WheelEvent) => {
    if (isTransitioningRef.current) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    if (e.deltaY > 0) {
      navigateToSection('next');
    } else {
      navigateToSection('prev');
    }
  }, [navigateToSection]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStartRef.current === null) return;

    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped up - next section
        navigateToSection('next');
      } else {
        // Swiped down - previous section
        navigateToSection('prev');
      }
    }

    touchStartRef.current = null;
  }, [navigateToSection]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isTransitioningRef.current) return;

    if (e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      navigateToSection('next');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateToSection('prev');
    }
  }, [navigateToSection]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current as any);
      }
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd, handleKeyDown]);

  const renderSection = () => {
    if (currentProject === 0) {
      return <HeroSection onViewWork={() => goToSection(1)} />;
    } else if (currentProject === totalSections - 1) {
      return <FooterSection />;
    } else {
      const projectIndex = currentProject - 1;
      const project = projects[projectIndex];
      // Support both single video and videos array
      const videoList = project.videos ?? (project.video ? [project.video] : []);
      return (
        <ProjectSection
          project={project}
          videoList={videoList}
          onVideoClick={(url) => setSelectedVideo(url)}
          onImageClick={(image) => setSelectedImage(image)}
        />
      );
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background text-foreground touch-none">
      {/* Main Content with fade transition */}
      <div className="relative w-full h-screen flex items-center justify-center">
        <div key={animationKey} className="w-full" style={{
          animation: 'fadeIn 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards'
        }}>
          {renderSection()}

          {/* Video Modal */}
          {selectedVideo && (
            <div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedVideo(null)}
            >
              <div
                className="relative w-full max-w-4xl bg-black"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute -top-12 right-0 text-white text-3xl font-bold hover:opacity-70 transition-opacity"
                >
                  ✕
                </button>
                <video
                  src={selectedVideo}
                  controls
                  autoPlay
                  className="w-full aspect-video"
                />
              </div>
            </div>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 text-white text-3xl font-bold hover:opacity-70 transition-opacity"
                >
                  ✕
                </button>
                <img
                  src={selectedImage}
                  alt="Enlarged project preview"
                  className="max-w-full max-h-[85vh] object-contain border-4 border-foreground"
                  style={{ borderWidth: '6px' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Dots - Fixed on right */}
      <div className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 md:gap-4">
        {Array.from({ length: totalSections }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSection(idx)}
            className={`transition-all duration-300 ${idx === currentProject
              ? 'bg-foreground border-foreground scale-125'
              : 'bg-transparent border-foreground hover:scale-110'
              }`}
            style={{
              width: '12px',
              height: '12px',
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
            aria-label={`Go to section ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator - Only on Hero */}
      {currentProject === 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6" />
        </div>
      )}

      {/* Section Counter */}
      <div className="fixed bottom-6 md:bottom-8 left-6 md:left-8 text-xs md:text-sm font-mono text-muted-foreground">
        <span>{String(currentProject + 1).padStart(2, '0')}</span>
        <span className="mx-2">/</span>
        <span>{String(totalSections).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

function HeroSection({ onViewWork }: { onViewWork?: () => void }) {
  return (
    <section className="snap-section px-4 md:px-8 lg:px-16 w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        {/* Logo */}
        <div className="mb-12 md:mb-16">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-foreground flex items-center justify-center" style={{ borderWidth: '6px' }}>
            <span className="font-bold text-foreground text-sm md:text-base">OMRI</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-bold text-foreground leading-tight mb-4">
            ENGINEERED
            <br />
            WITH
            <br />
            INTENTION
          </h1>
          <div className="w-full md:w-2/3 h-1 bg-foreground mb-8" style={{ width: '294px' }} />
          <p className="text-base md:text-lg font-light max-w-2xl leading-relaxed">
            A portfolio of work built with uncompromising honesty. Each project reflects structural integrity, functional design, and deliberate craft. Form follows function. Always.
          </p>
        </div>

        {/* CTA */}
        <div className="flex gap-4 md:gap-6 items-center">
          <button
            onClick={onViewWork}
            className="border-foreground px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-mono font-semibold hover:bg-foreground hover:text-background transition-all duration-200 active:scale-95"
            style={{ borderWidth: '2px', borderStyle: 'solid' }}
          >
            VIEW WORK
          </button>
          <div className="text-xs md:text-sm font-mono text-muted-foreground">
            {projects.length} PROJECTS
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectSection({
  project,
  videoList = [],
  onVideoClick,
  onImageClick,
}: {
  project: Project;
  videoList?: string[];
  onVideoClick?: (url: string) => void;
  onImageClick?: (image: string) => void;
}) {
  const hasVideos = videoList.length > 0;
  const hasImage = !!project.image;

  return (
    <section className="snap-section px-4 md:px-8 lg:px-16 w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start md:items-center">
        {/* Image and Video */}
        <div className="order-2 md:order-1 w-full md:col-span-7 flex flex-row gap-2 md:gap-4 items-center">
          {project.images && project.images.length > 0 ? (
            project.images.map((imgSrc, idx) => (
              <div
                key={idx}
                className="border-4 border-foreground overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity w-1/3 aspect-[1024/470]"
                style={{ borderWidth: '4px' }}
                onClick={() => onImageClick?.(imgSrc)}
              >
                <img
                  src={imgSrc}
                  alt={`${project.title} preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <>
              {hasImage && (
                <div
                  className={`border-4 border-foreground overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity ${hasVideos
                    ? `h-32 w-auto md:h-[350px] ${project.aspectRatio || 'aspect-square'}`
                    : 'w-32 h-32 md:w-full md:aspect-square'
                    }`}
                  style={{ borderWidth: '6px' }}
                  onClick={() => onImageClick?.(project.image!)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {videoList.map((videoUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => onVideoClick?.(videoUrl)}
                  className={`relative border-4 border-foreground overflow-hidden bg-black cursor-pointer hover:opacity-80 transition-opacity group ${hasImage
                    ? 'h-32 w-32 md:h-[350px] md:aspect-square'
                    : 'w-32 h-32 md:w-full md:aspect-square'
                    }`}
                  style={{ borderWidth: '6px' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-2 border-white rounded-full group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-l-6 md:border-l-8 border-l-white border-t-4 md:border-t-6 border-t-transparent border-b-4 md:border-b-6 border-b-transparent ml-1" />
                    </div>
                  </div>
                  {videoList.length > 1 && (
                    <span className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-mono opacity-70">
                      {idx + 1}/{videoList.length}
                    </span>
                  )}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Content */}
        <div className="order-1 md:order-2 md:col-span-5">
          <div className="mb-6 md:mb-8">
            <h2 className="font-bold text-foreground mb-4 text-lg md:text-2xl">{project.title}</h2>
            <div className="w-16 h-1 bg-foreground mb-6" />
            <p className="text-xs md:text-sm leading-relaxed text-foreground/90 mb-6 line-clamp-6">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-mono border-foreground"
                style={{ borderWidth: '1px', borderStyle: 'solid' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Button */}
          <div className="flex gap-4 flex-wrap">
            {project.link && (
              <a
                href={`mailto:ceo@palmera.live?subject=GitHub%20Access%20Request%20-%20${project.title}&body=Hi,%0A%0AI%20would%20like%20to%20request%20access%20to%20the%20GitHub%20repository%20for%20this%20project.%0A%0AThanks!`}
                className="inline-flex items-center gap-2 border-foreground px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-mono font-semibold hover:bg-foreground hover:text-background transition-all duration-200 active:scale-95"
                style={{ borderWidth: '2px', borderStyle: 'solid' }}
              >
                Explore Code
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <section className="snap-section px-4 md:px-8 lg:px-16 w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12 md:mb-16">
          <h2 className="font-bold text-foreground mb-6">GET IN TOUCH</h2>
          <div className="w-16 h-1 bg-foreground mb-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          <div>
            <p className="text-xs md:text-sm font-mono text-muted-foreground mb-2">EMAIL</p>
            <a
              href="mailto:hello@example.com"
              className="text-base md:text-lg hover:underline"
            >
              CEO@Palmera.live
            </a>
          </div>
          <div>
            <p className="text-xs md:text-sm font-mono text-muted-foreground mb-2">SOCIAL</p>
            <div className="flex gap-4 md:gap-6">
              <a target="_blank" href="https://www.linkedin.com/in/omri-h-0734723a9/" className="hover:underline">
                LinkedIn
              </a>
              <a target="_blank" href="https://github.com/omrialsheikh?tab=repositories/" className="hover:underline">
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="border-foreground pt-8 md:pt-12" style={{ borderTopWidth: '2px', borderTopStyle: 'solid' }}>
          <p className="text-xs md:text-sm font-mono text-muted-foreground">
            © 2026 CRAFTED WITH INTENTION. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </section>
  );
}
