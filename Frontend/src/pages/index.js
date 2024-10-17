import Head from 'next/head';
import { usePageView } from '../hooks/use-page-view';
import { Home } from '../sections/home/home';
import { useAuth } from '../hooks/use-auth';
import { useRouter } from 'next/router'
import { paths } from '../paths';

const Page = () => {
  usePageView();
  const { user } = useAuth()
  const router = useRouter()
  if (user?.id) router.push(paths.dashboard.index);

  return (
    <>
      <Head>
        <title>
          AI LEARNING SYSTEM
        </title>
      </Head>
      <main>
        <Home />
      </main>
    </>
  );
};

Page.getLayout = (page) => (
  <>
    {page}
  </>
);

export default Page;
