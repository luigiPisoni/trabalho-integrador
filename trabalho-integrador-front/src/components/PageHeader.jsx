function PageHeader({ titulo }) {
  return (
    <div className="mx-8 md:mx-24 pt-7 pb-3 border-b-2">
      <h1 className="text-5xl font-serif">{titulo}</h1>
    </div>
  );
}

export default PageHeader;
