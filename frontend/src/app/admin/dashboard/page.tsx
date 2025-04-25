// app/admin/dashboard/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import VilleForm from '@/components/admin/VilleForm';
import RequestsTable from '@/components/admin/RequestsTable';
import StatisticsChart from '@/components/admin/StatisticsChart';
import ReportedPostsSection from '@/components/admin/ReportedPostsSection';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/utils/authUtils';
export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  // const [stats, setStats] = useState({});
  const router = useRouter();

  // const [villeNom, setVilleNom] = useState('');
  useEffect(() => {
    if (!isAdmin()) {
      router.push('/unauthorized'); // ou '/login'
    }
  }, []);
  useEffect(() => {
    fetch('http://localhost:3001/admin/pending-users') // Remplace par ton port NestJS
      .then(res => res.json())
      .then(setRequests);
  
      // fetch('http://localhost:3003/api/publications/reported-posts')
      // .then(res => res.json())
      // .then(setReportedPosts);
  
    // fetch('/api/admin/stats')
    //   .then(res => res.json())
    //   .then(setStats);
  }, []);
  

  const acceptUser = async (id) => {
    await fetch(`http://localhost:3001/admin/approve-user/${id}`, {
      method: 'POST',
    });
    setRequests(requests.filter(req => req.id !== id));
  };
  

  const archivePost = async (publicationId) => {
    await fetch(`http://localhost:3003/api/publications/reported-posts/${publicationId}/archive`, {
      method: 'POST',
    });
    setReportedPosts(reportedPosts.filter(post => post.id_publication !== publicationId));
  };
  

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h1 className="mt-4 font-klavika font-medium text-center text-3xl text-slate-600 mb-12">Bureau d'administration EHEI - Dashboard</h1>
      <section className="mt-6 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <RequestsTable requests={requests} onAccept={acceptUser} />
        </div>
        <div className="col-span-2">
        {/* <Card>
          <CardHeader><CardTitle>Reported Posts</CardTitle></CardHeader>
          <CardContent>
            {reportedPosts.length === 0 ? (
              <p className="text-gray-500">Aucune publication signalée.</p>
            ) : (
              reportedPosts.map(post => (
                <div key={post.id_archive} className="mb-4 p-2 border rounded-md">
                  <p className="text-sm text-gray-800 mb-2">
                    {post.publication?.description?.substring(0, 100) || 'Contenu indisponible'}
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => archivePost(post.id_publication)}
                  >
                    Archiver
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card> */}
        <ReportedPostsSection />
        </div>
        <section className="col-span-2 mt-6">
          <StatisticsChart />
        </section>
      </section>
      <section className="mt-6">
        <Link href="http://localhost:4000/d/Kn5xm-gZk/rabbitmq-overview?orgId=1&from=now-15m&to=now&timezone=browser&var-DS_PROMETHEUS=default&var-namespace=&var-rabbitmq_cluster=rabbit@rabbitmq&refresh=15s" target="_blank">
          <Button variant="destructive">View Monitoring (Grafana)</Button>
        </Link>
      </section>
      <section className="mt-6 grid grid-cols-2 gap-4">
        <VilleForm />
        <Card>
          <CardHeader><CardTitle>Ajouter une Entreprise</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="company">Nom de l'entreprise</Label>
            <Input id="company" placeholder="Ex: OCP Group" />
            <Button variant="blue">Ajouter</Button>
            <div className="mt-6">
            <Button variant="outline" onClick={() => {}}>
                Voir la liste des entreprises
            </Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Ajouter une Technologie</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="tech">Nom de la technologie</Label>
            <Input id="tech" placeholder="Ex: React.js" />
            <Button variant="blue">Ajouter</Button>
            <div className="mt-6">
            <Button variant="outline" onClick={() => {}}>
                Voir la liste des technologies
            </Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Ajouter une Offre d'emploi</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="offre">Titre de l'offre</Label>
            <Input id="offre" placeholder="Ex: Développeur Full Stack" />
            <Button variant="blue">Ajouter</Button>
            <div className="mt-6">
            <Button variant="outline" onClick={() => {}}>
                Voir la liste des offres
            </Button></div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
} 