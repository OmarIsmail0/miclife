import { sanitizeHtml } from "@/src/lib/sanitize";

interface ProductDescriptionProps {
  title: string;
  description: string;
  image?: string;
}

const ProductDescription = ({ title, description, image }: ProductDescriptionProps) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 items-center my-10">
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(description, { allowLinks: true }) }} />
        {image && (
          <div className="flex w-full justify-end">
            <img src={image} className="h-52 w-auto" alt={`${title} - Al Mohandes Insurance`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
