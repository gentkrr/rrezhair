import { GitBranch, Server, Terminal, CheckCircle, Github } from 'lucide-react';

const CICDPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-900 mb-8">Documentation CI/CD</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Github className="h-8 w-8 text-slate-900" />
                        Pipeline GitHub Actions
                    </h2>
                    <p className="text-slate-600 mb-6">
                        L'automatisation du projet est gérée par un workflow GitHub Actions défini dans le fichier <code>.github/workflows/ci-cd.yml</code>.
                        Ce pipeline s'exécute à chaque push sur les branches principales.
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="bg-blue-100 p-3 rounded-xl h-fit">
                                <GitBranch className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">1. Build</h3>
                                <p className="text-slate-600 text-sm">
                                    Construction des images Docker pour l'API et le Client. Vérifie que le code compile correctement.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-yellow-100 p-3 rounded-xl h-fit">
                                <CheckCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">2. Test</h3>
                                <p className="text-slate-600 text-sm">
                                    Exécution des tests unitaires et d'intégration via <code>npm test</code>. Le déploiement est bloqué si les tests échouent.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-green-100 p-3 rounded-xl h-fit">
                                <Server className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">3. Deploy</h3>
                                <p className="text-slate-600 text-sm">
                                    Déploiement automatique sur le serveur de production via SSH (uniquement sur la branche <code>main</code>).
                                    <br />
                                    <code className="bg-slate-100 px-2 py-1 rounded text-xs mt-2 inline-block">git pull && docker compose up -d --build</code>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 text-slate-300 rounded-2xl p-8">
                    <h3 className="text-white font-bold text-lg mb-4">Lien vers les Actions</h3>
                    <p className="mb-4">
                        Vous pouvez suivre l'état des workflows directement sur GitHub :
                    </p>
                    <a
                        href="https://github.com/gentkrr/rrezhair/actions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition"
                    >
                        <Github className="h-5 w-5" />
                        Voir les GitHub Actions
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CICDPage;
