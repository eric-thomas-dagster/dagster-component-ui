import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CatalogProvider } from "./context/CatalogContext";
import { Home } from "./pages/Home";
import { ExamplesIndex } from "./pages/ExamplesIndex";
import { ExampleDetail } from "./pages/ExampleDetail";
import { ComponentDetail } from "./pages/ComponentDetail";
import { GetStartedPage } from "./pages/GetStartedPage";
import { AiAssistantsPage } from "./pages/AiAssistantsPage";

export default function App() {
  return (
    <CatalogProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/ai-assistants" element={<AiAssistantsPage />} />
          <Route path="/examples" element={<ExamplesIndex />} />
          <Route path="/examples/:slug" element={<ExampleDetail />} />
          <Route path="/c/:id" element={<ComponentDetail />} />
        </Routes>
      </Layout>
    </CatalogProvider>
  );
}
