import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function VilleForm() {
  const [villes, setVilles] = useState([]);
  const [nom, setNom] = useState('');
  const [editId, setEditId] = useState(null);
  const [showList, setShowList] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const fetchVilles = async () => {
    const res = await fetch('http://localhost:3003/api/villes');
    const data = await res.json();
    setVilles(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId
      ? `http://localhost:3003/api/villes/${editId}`
      : 'http://localhost:3003/api/villes';

    const method = editId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom }),
    });

    setNom('');
    setEditId(null);
    fetchVilles();
  };

  const handleDelete = async (id_ville) => {
    await fetch(`http://localhost:3003/api/villes/${id_ville}`, { method: 'DELETE' });
    fetchVilles();
  };

  const handleEdit = (ville) => {
    setNom(ville.nom);
    setEditId(ville.id);
  };

  const visibleVilles = showAll ? villes : villes.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter une Ville</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ville-nom">Nom de la ville</Label>
            <Input
              id="ville-nom"
              placeholder="ex: Berkane"
              className="mt-4"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <Button variant="blue" type="submit">{editId ? 'Modifier' : 'Ajouter'}</Button>
        </form>

        <div className="mt-4">
          <Button variant="outline" onClick={() => {
            setShowList(!showList);
            if (!showList) fetchVilles();
          }}>
            {showList ? 'Masquer la liste' : 'Voir la liste des villes'}
          </Button>

          {showList && (
            <div className="mt-4 max-h-60 overflow-y-auto border rounded p-2">
              {visibleVilles.map((ville) => (
                <div key={ville.id_ville} className="flex justify-between items-center border p-2 rounded mb-2">
                  <span>{ville.nom}</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(ville)}>Modifier</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(ville.id_ville)}>Supprimer</Button>
                  </div>
                </div>
              ))}

              {villes.length > 5 && !showAll && (
                <div className="text-center mt-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowAll(true)}>
                    Afficher tout ({villes.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default VilleForm;
