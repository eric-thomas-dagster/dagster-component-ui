import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CatalogProvider } from "./context/CatalogContext";
import { Home } from "./pages/Home";
import { ExamplesIndex } from "./pages/ExamplesIndex";
import { ExampleDetail } from "./pages/ExampleDetail";
import { ComponentDetail } from "./pages/ComponentDetail";

export default function App() {
  return (
    <CatalogProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/examples" element={<ExamplesIndex />} />
          <Route path="/examples/:slug" element={<ExampleDetail />} />
          <Route path="/c/:id" element={<ComponentDetail />} />
        </Routes>
      </Layout>
    </CatalogProvider>
  );
}
