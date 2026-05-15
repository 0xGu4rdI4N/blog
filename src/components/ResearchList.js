export default function ResearchList({ data }) {
    if (!data || !data.nodes) return null;

    // Group nodes by type
    const activeProjects = data.nodes.filter(n => n.type === 'project' && n.status === 'active');
    const pastProjects = data.nodes.filter(n => n.type === 'project' && n.status === 'past');
    const concepts = data.nodes.filter(n => n.type === 'concept');
    const tools = data.nodes.filter(n => n.type === 'tool');
    const domains = data.nodes.filter(n => n.type === 'domain');

    // Helper to get connected items for a project
    const getConnectedItems = (nodeId) => {
        const connections = data.links
            .filter(l => l.source === nodeId || l.target === nodeId)
            .map(l => {
                const targetId = l.source === nodeId ? l.target : l.source;
                return data.nodes.find(n => n.id === targetId);
            })
            .filter(Boolean);
            
        return connections;
    };

    const renderProjectList = (projects) => (
        <div className="space-y-8">
            {projects.map(project => {
                const connected = getConnectedItems(project.id);
                return (
                    <div key={project.id} className="group">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors">
                            {project.label}
                        </h3>
                        {project.tags && project.tags.length > 0 && (
                            <div className="flex gap-2 my-2">
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-stone-100 dark:bg-neutral-800 text-stone-500 dark:text-stone-400 text-[10px] uppercase tracking-wider rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2 text-sm sm:text-base">
                            {project.description}
                        </p>
                        {connected.length > 0 && (
                            <div className="mt-3 text-sm text-stone-500">
                                <span className="font-semibold text-stone-600 dark:text-stone-400">Related:</span>{' '}
                                {connected.map(c => c.label).join(', ')}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    const renderTagCloud = (items, bgColorClass) => (
        <div className="flex flex-wrap gap-2">
            {items.map(item => (
                <span key={item.id} className={`px-3 py-1 ${bgColorClass} text-stone-700 dark:text-stone-300 rounded-full text-sm border border-stone-200 dark:border-neutral-800`}>
                    {item.label}
                </span>
            ))}
        </div>
    );

    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {activeProjects.length > 0 && (
                <section>
                    <h2 className="font-serif text-2xl font-bold mb-6 text-black dark:text-white border-b border-stone-200 dark:border-neutral-800 pb-2">
                        Active Projects
                    </h2>
                    {renderProjectList(activeProjects)}
                </section>
            )}

            {pastProjects.length > 0 && (
                <section>
                    <h2 className="font-serif text-2xl font-bold mb-6 text-black dark:text-white border-b border-stone-200 dark:border-neutral-800 pb-2">
                        Past Projects
                    </h2>
                    {renderProjectList(pastProjects)}
                </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {concepts.length > 0 && (
                    <section>
                        <h2 className="font-serif text-xl font-bold mb-4 text-black dark:text-white">
                            Concepts Explored
                        </h2>
                        {renderTagCloud(concepts, 'bg-blue-50 dark:bg-blue-900/20')}
                    </section>
                )}

                {tools.length > 0 && (
                    <section>
                        <h2 className="font-serif text-xl font-bold mb-4 text-black dark:text-white">
                            Methods & Tools
                        </h2>
                        {renderTagCloud(tools, 'bg-amber-50 dark:bg-amber-900/20')}
                    </section>
                )}
            </div>
        </div>
    );
}
