import Hero from '../../components/home/Hero';
import FeaturedCategories from '../../components/home/FeaturedCategories';
import TrendingGames from '../../components/home/TrendingGames';
import PopularConsoles from '../../components/home/PopularConsoles';
import WhyChoose from '../../components/home/WhyChoose';
import FlashSale from '../../components/home/FlashSale';
import Testimonials from '../../components/home/Testimonials';
import Newsletter from '../../components/home/Newsletter';

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gaming-dark">
      <Hero />
      <FeaturedCategories />
      <TrendingGames />
      <PopularConsoles />
      <WhyChoose />
      <FlashSale />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
