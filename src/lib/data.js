export const PUBLICATIONS = [
    {
        title: "Unsupervised Clustering of Single-Cell RNA-seq Data",
        venue: "Undergraduate Research Symposium '23",
        desc: "Implemented a Variational Autoencoder (VAE) to reduce dimensionality of scRNA-seq data, revealing distinct cell subpopulations in heterogeneous tumor samples.",
        link: "#",
        tech: ["PyTorch", "Scanpy", "Python"]
    },
    {
        title: "Graph Neural Networks for Drug Interaction Prediction",
        venue: "Bio-ML Hackathon (1st Place)",
        desc: "Modeled molecular structures as graphs to predict adverse drug-drug interactions with 89% accuracy using a Message Passing Neural Network.",
        link: "#",
        tech: ["PyG", "RDKit", "Graph Theory"]
    }
];

export const TIMELINE_ITEMS = [
    {
        year: '2023',
        title: 'Research Intern @ BioTech Inc.',
        desc: 'Developed CNN models for CRISPR off-target detection.',
        icon: 'briefcase'
    },
    {
        year: '2022',
        title: 'Published Protein Folding Paper',
        desc: 'Investigated transformer attention maps for structural prediction.',
        icon: 'file'
    },
    {
        year: '2021',
        title: 'Open Source Genomics',
        desc: 'Built Python tools for fast DNA sequence alignment.',
        icon: 'code'
    }
];

export const EXTRAS = [
    {
        id: 1,
        type: 'insight',
        title: "Noise is a feature",
        content: "Biological systems aren't just noisy; they are often noise-driven. Deterministic models fail because they treat stochasticity as a bug, whereas evolution treats it as a search strategy.",
        date: '2024-03-10'
    },
    {
        id: 2,
        type: 'link',
        title: "The Bitter Lesson",
        content: "Rich Sutton's essay on why general methods that leverage computation ultimately triumph over human-designed priors. Essential reading for AI Bio.",
        url: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html",
        date: '2024-02-28'
    },
    {
        id: 3,
        type: 'tool',
        title: "PyMOL 3.0",
        content: "The new rendering engine in PyMOL 3.0 is a game changer for visualizing protein surfaces. Finally supports real-time ray tracing without plugins.",
        date: '2024-01-15'
    },
    {
        id: 4,
        type: 'quote',
        title: "On Complexity",
        content: "The interesting thing about biology is that it is typically more complex than we think it is, but simpler than we think it must be.",
        author: "Unknown",
        date: '2023-12-20'
    }
];
