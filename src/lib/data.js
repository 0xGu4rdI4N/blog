export const PUBLICATIONS = [
    {
        title: "Coarse composition suffices: tabular in-context learning for multi-activity antimicrobial peptide profiling",
        authors: "A. Pal*, Raunak Kumar*, D. Solanki*, P. Pareek, J. Singh, J. Singla (*Equal contribution)",
        venue: "bioRxiv preprint; under review at Bioinformatics (Oxford University Press)",
        desc: "Developed a gradient-free, tabular in-context learning framework using TabPFN and 330 sequence-derived descriptors, completely bypassing computationally heavy 3D structure prediction to profile multi-activity antimicrobial peptides. Achieved SOTA multi-label performance on the ESCAPE benchmark (82k+ peptides, 5 labels), increasing macro AP from 72.1% to 77.8% and outperforming prior deep multimodal baselines across all 5 targets simultaneously with strong out-of-domain generalization.",
        link: "https://www.biorxiv.org/content/10.64898/2026.08.27.747591v2"
    }
];

export const EXPERIENCES = [
    {
        role: "Amgen Scholar",
        org: "Amgen Scholars Program – IIIT Hyderabad",
        location: "On-site",
        period: "July 2026 – August 2026",
        project: "Bayesian Optimization for Ultra-Large Virtual Screening of EphA2 Ligands",
        desc: "Independently designed and validated a Bayesian optimization framework for virtually screening a 100M small-molecule library, recovering >90% of top-500 candidates while docking ~1% of the library at a throughput of 34.1 ms/molecule (~1M molecules in 25–33 hrs on a single GPU). Developed a hierarchical pipeline integrating ensemble docking and molecular dynamics to refine hits to 5 high-confidence EphA2 binder candidates for experimental validation.",
        highlight: "Best Presentation Award among 75 international scholars at the Asia Amgen Scholars Symposium (The University of Tokyo)"
    },
    {
        role: "AI Research Intern",
        org: "Mandrake Bioworks",
        location: "Remote",
        period: "October 2025 – December 2025",
        project: "De novo Protein Design",
        desc: "Developed a de novo protein design pipeline for reverse transcriptases targeting prime editing, combining RFdiffusion backbone generation with ProteinMPNN inverse folding for 10,000 candidates. Designed a UMAP-based filtering pipeline and adapted Gemma-4B for protein language modeling via LoRA.",
        link: "https://mandrakebio.com"
    }
];

export const TIMELINE_ITEMS = [];

// Google Doc Live Embeds
// To add a new one:
//   1. In Google Docs → File → Share → Publish to web → Copy the link
//   2. Add a new entry below with a unique slug, title, and that link as `docUrl`
//   3. The page will be live at /notes/<slug>
export const GDOC_EMBEDS = [
    {
        slug: 'research-practices',
        title: 'Research Practices',
        description: 'my points on research ',
        docUrl: 'https://docs.google.com/document/d/1Q1seMe54rqD35d5zzkFDRtd1j75j4IWrHqnJiDmQHo4/edit?usp=sharing',
    },
];

export const VISION = {
    paragraphs: [
        `I was sitting in the library, along the shelves where there was no one except me and thousands of books. I was looking at "The Cultural Heritage of India" by Ramkrishna Mission and really felt sad that I would not come to know the great authors of this book. In that moment, I also saw books that, in my opinion, would not have been read much — and a feeling of respect for the authors who write these books even if there is not a large quantitative audience. They are the guardians of our time, our story, our legacy to the future.`,

        `In that moment, something struck me. An avid reader can read around 2000 books in his/her lifetime — that's 4 lines of shelves (I counted). I wanted people to live. Live long enough to be able to read all the books that are written up to that moment. I want people to have the freedom of feeling all the variations of physical and mental experiences. Imagine when one can be a poet, painter, physicist, biologist, singer, dancer, and all that he wishes.`,

        `I read somewhere that your spark will return again, and you must hold on to it. I feel this is my spark returning to me, and I will hold on this time. I will forget things — at least may not be able to recall because I live in the present — but now I know that I have had realisations, thoughts, learnings. I will live with the assurance that I did have it, and not be obsessed with holding on to it only in the form of words or thoughts. It was reality and will live in me, in my blood and skin.`,

        `Moments come to go away, they say. But we should rather notice that the moments actually come to be lived first.`,

        `Actually, the branch of Biosciences that focuses on human biological systems, at the root, is about longevity. A person who would otherwise die by 40 can now live to 80. So for me geroscience is not limited to only extension of ideal human age, but rather the union of all attempts that strive to improve human health.`,

        `Computational Modeling has improved a lot in past few years, thanks to the pace of AI development. In my view, we have until now focused a lot on the static picture of life (a snapshot) — and that was absolutely the prerequisite — but now it's time to shift, even if partially, to the dynamics, because life is dynamic. I am particularly interested in working towards understanding human health degradation with time, and the dynamics responsible for it in the cell. The example of the cryptic switch-II pocket in KRAS nicely illustrates why protein dynamics matters: potentially druggable sites may not be obvious from a single static structure and can emerge from the conformational ensemble. Then, as has been the way generally, to transfer part of this science to computers to come up with faster ways of finding a "cure".`,

        `Even the data, like scRNA-seq temporally, is made of discrete cells because imaging the cells destroys them — so trajectory finding is an approximation, and better computational models are always welcomed.`,
    ],
    keywords: [
        "Longevity",
        "Dynamics",
        "Cell Fate",
        "Uncertainty Quantification",
        "Generalization",
        "Beyond Likelihood",
        "Causality",
        "Compute Feasible",
        "Simulation",
    ],
};



