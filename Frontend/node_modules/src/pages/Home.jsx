import Hero from '../sections/Hero';
import About from '../sections/About';
import Projects from '../sections/Projects';
import Process from '../sections/Process';
import Tools from '../sections/Tools';
import Contact from '../sections/Contact';

// The "/" route: stacks every section vertically into one scrollable page.
const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Process />
      <Tools />
      <Contact />
    </>
  );
};

export default Home;
