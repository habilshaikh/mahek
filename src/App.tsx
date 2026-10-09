import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const named = <T extends Record<string, React.ComponentType<any>>>(loader: () => Promise<T>, key: keyof T) =>
  lazy(() => loader().then((m) => ({ default: m[key] as React.ComponentType<any> })));

const Shop = lazy(() => import('./pages/Shop'));
const Collection = lazy(() => import('./pages/Collection'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const OurStory = lazy(() => import('./pages/OurStory'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PolicyPage = lazy(() => import('./pages/Policies'));
const FragranceFinderPage = named(() => import('./pages/Discovery'), 'FragranceFinderPage');
const ScentWheelPage = named(() => import('./pages/Discovery'), 'ScentWheelPage');
const Journal = named(() => import('./pages/Journal'), 'Journal');
const JournalArticle = named(() => import('./pages/Journal'), 'JournalArticle');
const NewsletterPage = named(() => import('./pages/Journal'), 'NewsletterPage');
const Wishlist = named(() => import('./pages/Shopping'), 'Wishlist');
const Cart = named(() => import('./pages/Shopping'), 'Cart');
const Checkout = named(() => import('./pages/Shopping'), 'Checkout');
const Account = named(() => import('./pages/Account'), 'Account');
const Orders = named(() => import('./pages/Account'), 'Orders');
const Addresses = named(() => import('./pages/Account'), 'Addresses');
const TrackOrder = named(() => import('./pages/Account'), 'TrackOrder');
const ImageCredits = lazy(() => import('./pages/ImageCredits'));
// Dev-only render studio for generating illustrative product imagery (stripped from production builds).
const RenderStage = import.meta.env.DEV ? lazy(() => import('./render/RenderStage')) : null;

export default function App() {
  return (
    <Routes>
      {RenderStage && (
        <Route
          path="__render"
          element={
            <Suspense fallback={null}>
              <RenderStage />
            </Suspense>
          }
        />
      )}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="collections/:slug" element={<Collection />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="fragrance-finder" element={<FragranceFinderPage />} />
        <Route path="scent-wheel" element={<ScentWheelPage />} />
        <Route path="our-story" element={<OurStory />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="journal" element={<Journal />} />
        <Route path="journal/:slug" element={<JournalArticle />} />
        <Route path="newsletter" element={<NewsletterPage />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="account" element={<Account />} />
        <Route path="account/orders" element={<Orders />} />
        <Route path="account/addresses" element={<Addresses />} />
        <Route path="track-order" element={<TrackOrder />} />
        <Route path="shipping-policy" element={<PolicyPage type="shipping" />} />
        <Route path="returns-policy" element={<PolicyPage type="returns" />} />
        <Route path="privacy-policy" element={<PolicyPage type="privacy" />} />
        <Route path="terms" element={<PolicyPage type="terms" />} />
        <Route path="image-credits" element={<ImageCredits />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
