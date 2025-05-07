import ClientPage from './ClientPage';

export default function Page({ params }: { params: { id_publication: string } }) {
  return <ClientPage id_publication={params.id_publication} />;
}
