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



