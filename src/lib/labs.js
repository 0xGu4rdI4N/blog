// Data for the /labs "AI4Science Atlas" page.
// To add another university, push a new object onto UNIVERSITIES with its own
// `groups` (domain sections) and `rows` (one entry per lab, tagged with a group
// key `g` and a list of program codes it's affiliated with).
//
// Row shape: { g, lab, pi, progs: [code,...], kw, evi, c: 1|0, note? }
//   g    - group key (must match a groups[].key for this university)
//   lab  - lab/group name
//   pi   - professor / PI name(s)
//   progs- doctoral program codes the lab is affiliated with
//   kw   - short research-alignment / keyword line
//   evi  - concrete evidence (paper, stated pillar, project)
//   c    - 1 = confirmed (stated pillar or specific paper), 0 = borderline
//   note - optional flag, e.g. conflicting evidence across passes

export const UNIVERSITIES = [
  {
    id: 'epfl',
    name: 'EPFL',
    fullName: 'École Polytechnique Fédérale de Lausanne',
    location: 'Lausanne, Switzerland',
    programsUrl: 'https://www.epfl.ch/education/phd/programs/',
    blurb:
      'Labs across EPFL’s 22 doctoral programs whose research has a genuine, evidence-backed machine-learning / AI component applied to a science or engineering domain — screened lab-by-lab against stated research pillars and recent publications.',
    groups: [
      { key: 'ai4bio', label: 'AI4Bio — Molecular Engineering & Synthetic Biology', code: 'EDBB', tone: 'bio' },
      { key: 'chem', label: 'Chemistry & Chemical Engineering', code: 'EDCH', tone: 'sci' },
      { key: 'materials', label: 'Materials Science & Engineering', code: 'EDMX', tone: 'sci' },
      { key: 'physics', label: 'Physics', code: 'EDPY', tone: 'sci' },
      { key: 'energy', label: 'Energy', code: 'EDEY', tone: 'sci' },
      { key: 'civil', label: 'Civil & Environmental Engineering', code: 'EDCE', tone: 'sci' },
      { key: 'manufacturing', label: 'Advanced Manufacturing', code: 'EDAM', tone: 'sci' },
      { key: 'csrm', label: 'Computer Science, Robotics & Mathematics', code: 'EDIC · EDRS · EDMA', tone: 'sci' },
      { key: 'eemp', label: 'Electrical Eng., Microsystems & Photonics', code: 'EDEE · EDMI · EDPO', tone: 'sci' },
      { key: 'mech', label: 'Mechanics', code: 'EDME', tone: 'sci' },
      { key: 'cbn', label: 'Comp. Biology, Molecular Life Sciences & Neuroscience', code: 'EDCB · EDMS · EDNE', tone: 'bio' },
      { key: 'archhum', label: 'Architecture & Digital Humanities', code: 'EDAR · EDDH', tone: 'soft' },
      { key: 'fme', label: 'Finance, Mgmt. of Technology & Learning Sciences', code: 'EDFI · EDMT · JDPLS', tone: 'soft' },
    ],
    rows: [
      // ---- AI4BIO ----
      { g: 'ai4bio', lab: 'LPDI', pi: 'Bruno Correia', progs: ['EDBB', 'EDCH', 'EDCB'], kw: 'ML for protein surfaces; deep learning protein & vaccine design', evi: 'Stated pillar "ML approaches for study of protein surfaces"; MaSIF; DL pipeline for protein binder design (2024–25)', c: 1 },
      { g: 'ai4bio', lab: 'LCSB', pi: 'Vassily Hatzimanikatis', progs: ['EDBB', 'EDCH'], kw: 'Generative ML for metabolic kinetic modeling', evi: 'RENAISSANCE AI tool; Choudhury et al., Nat. Catalysis 2024', c: 1 },
      { g: 'ai4bio', lab: 'Laboratory of Protein and Cell Engineering', pi: 'Patrick Barth', progs: ['EDBB'], kw: 'Deep learning for de novo protein & membrane-protein design', evi: 'Two bioRxiv 2025 papers on DL-based protein/membrane design', c: 1 },
      { g: 'ai4bio', lab: 'LBM', pi: 'Matteo Dal Peraro', progs: ['EDBB', 'EDPY', 'EDCB'], kw: 'Geometric deep learning for protein structure, interfaces & cryo-EM', evi: 'PeSTo (Nat. Commun. 2023); PeSTo-Carbs (JCTC 2024)', c: 1 },
      { g: 'ai4bio', lab: 'Laboratory of Systems Biology and Genetics', pi: 'Bart Deplancke', progs: ['EDBB', 'EDMI', 'EDCB'], kw: 'ML for regulatory genomics & chromatin accessibility; generative AI for DNA design', evi: 'ChromatinHD (Nat. Commun. 2025); DNA-Diffusion', c: 1 },
      { g: 'ai4bio', lab: 'G-Lab / Center for Neuroprosthetics', pi: 'Grégoire Courtine', progs: ['EDBB', 'EDRS'], kw: 'ML decoders for brain–spine interfaces', evi: 'Lorach et al., Nature 2023; Tabulae Paralytica, Nature 2024', c: 1 },
      { g: 'ai4bio', lab: 'Antanasijevic Lab', pi: 'Aleksandar Antanasijevic', progs: ['EDBB', 'EDCB'], kw: 'Cryo-EM + ML for antibody/epitope prediction', evi: '"Decoding epitope immunodominance in HIV Env using cryoEM and ML" (2026)', c: 1 },
      { g: 'ai4bio', lab: 'LBEN — Nanoscale Biology', pi: 'Aleksandra Radenovic', progs: ['EDBB', 'EDCH', 'EDMX', 'EDCB', 'EDMI', 'EDPO'], kw: 'Neuromorphic/ML-hardware via bio-nanopores; deep learning for real-time microscopy', evi: 'ERC "NEON" grant (2025); DL-assisted SICM imaging (Small Methods 2025)', c: 0 },
      { g: 'ai4bio', lab: 'Computational and Systems Biology', pi: 'Felix Naef', progs: ['EDBB'], kw: 'Circumstantial ML: teaches "ML for Physicists", presents at ML-in-comp-bio venues', evi: 'No specific ML paper pinned down — core work is stochastic/dynamical modeling', c: 0 },
      { g: 'ai4bio', lab: 'Kim Lab — Molecular & Synthetic Neuroengineering', pi: 'Yoon Kim', progs: ['EDBB'], kw: 'PI’s prior work used ML for protein–protein interaction engineering; lab brand-new at EPFL', evi: '"Deploying synthetic coevolution and ML to engineer PPIs", Science 2023 (pre-EPFL)', c: 0 },

      // ---- CHEMISTRY ----
      { g: 'chem', lab: 'LCMD', pi: 'Clémence Corminboeuf', progs: ['EDCH'], kw: 'ML-accelerated catalyst discovery; GA+ML inverse design', evi: '"ML meets volcano plots: computational discovery of cross-coupling catalysts", Chem. Sci. 2018', c: 1 },
      { g: 'chem', lab: 'LIAC', pi: 'Philippe Schwaller', progs: ['EDCH', 'EDIC'], kw: 'Transformers for reaction prediction & retrosynthesis; LLMs for chemistry', evi: 'Molecular Transformer; DRFP reaction fingerprinting', c: 1 },
      { g: 'chem', lab: 'LRM', pi: 'Lyndon Emsley', progs: ['EDCH'], kw: 'ML-predicted NMR chemical shifts for de novo crystal structure determination', evi: 'ShiftML / ShiftML4; JACS 2022', c: 1 },
      { g: 'chem', lab: 'LPDC', pi: 'Jeremy Luterbacher', progs: ['EDCH'], kw: 'Explainable AI (SHAP) applied to lignin-extraction process chemistry', evi: 'SHAP-based explainable ML models for lignocellulosic biomass extraction', c: 1 },
      { g: 'chem', lab: 'LNCE', pi: 'Raffaella Buonsanti', progs: ['EDCH'], kw: 'Data-driven / ML prediction of colloidal nanocrystal synthesis outcomes', evi: '"Holistic Data-Driven Approach to Synthesis Predictions of Nanocrystal Shapes", JACS 2024–25', c: 1 },
      { g: 'chem', lab: 'C3MP', pi: 'Oleg Yazyev', progs: ['EDCH', 'EDPY'], kw: 'ML (gradient-boosted trees) for topological-materials discovery & classification', evi: '"Detection of Topological Materials with Machine Learning" (~90% accuracy)', c: 1 },
      { g: 'chem', lab: 'Biophysics Group', pi: 'Paolo De Los Rios', progs: ['EDCH'], kw: 'Deep learning & statistical mechanics for protein folding and surface prediction', evi: 'Lab page: "Machine learning approaches for the study of protein surfaces"', c: 1 },

      // ---- MATERIALS ----
      { g: 'materials', lab: 'COSMO', pi: 'Michele Ceriotti', progs: ['EDMX', 'EDPY'], kw: 'Machine-learning interatomic potentials (MLIPs) for atomistic simulation', evi: 'PET-MAD, #1 on Matbench Discovery (2025)', c: 1 },
      { g: 'materials', lab: 'LSMO', pi: 'Berend Smit', progs: ['EDMX', 'EDCH'], kw: 'AI-driven discovery of nanoporous materials (MOFs, zeolites)', evi: 'MOFTransformer; Digital Discovery 2024', c: 1 },
      { g: 'materials', lab: 'MADES', pi: 'Anirudh Raju Natarajan', progs: ['EDMX'], kw: 'ML-augmented cluster expansions for multicomponent-alloy energetics', evi: 'npj Computational Materials 2025', c: 1 },
      { g: 'materials', lab: 'THEOS', pi: 'Nicola Marzari', progs: ['EDMX'], kw: 'AI/data-driven high-throughput materials discovery; Materials Cloud/AiiDA', evi: 'IBM Faculty Award for AI-curated materials datasets (2024–25)', c: 1 },
      { g: 'materials', lab: 'MATMAT', pi: 'Michael Herbst', progs: ['EDMX', 'EDMA'], kw: 'ML for error/uncertainty propagation in first-principles materials simulation', evi: 'Algorithmic differentiation for plane-wave DFT (arXiv 2025); DFTK.jl', c: 1 },
      { g: 'materials', lab: 'LSMS', pi: 'Jean-François Molinari', progs: ['EDMX', 'EDCE', 'EDME'], kw: 'Data-driven ML mechanics for tribology and materials damage', evi: '"ML for computational fracture and damage mechanics", Eng. Fracture Mechanics 2026', c: 1 },
      { g: 'materials', lab: 'LMD — Data-Driven Mechanics Lab', pi: 'Konstantinos Karapiperis', progs: ['EDMX', 'EDCE', 'EDME'], kw: 'Physics-informed / scientific ML for mechanics of material failure', evi: 'Lab explicitly named "Data-Driven Mechanics"; "Scientific ML" research tag', c: 1 },
      { g: 'materials', lab: 'INE', pi: 'Vasiliki Tileli', progs: ['EDMX'], kw: 'Deep learning for electron-microscopy image analysis of nanomaterials', evi: 'Fritz Haber Institute talk: "Discovering Materials Transformations...Using Deep Learning"', c: 1 },

      // ---- PHYSICS ----
      { g: 'physics', lab: 'CQSL', pi: 'Giuseppe Carleo', progs: ['EDPY'], kw: 'Neural-network quantum states for many-body quantum physics', evi: '"Solving the Quantum Many-Body Problem with ANNs", Science 2017; NetKet', c: 1 },
      { g: 'physics', lab: 'QIC', pi: 'Zoë Holmes', progs: ['EDPY'], kw: 'Quantum ML theory — trainability & barren plateaus in variational quantum algorithms', evi: '"Barren Plateaus Preclude Learning Scramblers" (2020)', c: 1 },
      { g: 'physics', lab: 'LTPN', pi: 'Vincenzo Savona', progs: ['EDPY', 'EDPO'], kw: 'Neural-network (RBM) representations of quantum states for dissipative dynamics', evi: '"Neural-Network Approach to Dissipative Quantum Many-Body Dynamics", PRL 2019', c: 1 },
      { g: 'physics', lab: 'Computational Biology & Theoretical Biophysics Lab', pi: 'Anne-Florence Bitbol', progs: ['EDPY', 'EDCB'], kw: 'ML / protein language models for coevolution-based inference in biophysics', evi: '"Generative power of a protein language model trained on multiple sequence alignments"', c: 1 },
      { g: 'physics', lab: 'LASTRO', pi: 'Jean-Paul Kneib', progs: ['EDPY', 'EDRS', 'EDEE', 'EDAR'], kw: 'Deep learning for astrophysical data — gravitational lensing, cosmology', evi: '"Deep Learning in Wide-field Surveys: Fast Analysis of Strong Lenses" (2019); ODISSEE project', c: 1 },

      // ---- ENERGY ----
      { g: 'energy', lab: 'TEBEL / ICE', pi: 'Dolaana Khovalyg', progs: ['EDEY'], kw: 'Reinforcement learning for HVAC / building climate control', evi: 'EPFL news: RL-trained smart controllers for indoor climate', c: 1 },
      { g: 'energy', lab: 'UNFoLD', pi: 'Karen Mulleners', progs: ['EDEY', 'EDME'], kw: 'ML (genetic algorithm) for flow control & wind-turbine blade-pitch optimization', evi: 'Le Fouest & Mulleners, Nature Communications 2024', c: 1 },
      { g: 'energy', lab: 'STREEM', pi: 'Mirko Musa', progs: ['EDEY'], kw: 'Deep learning for river-morphodynamics prediction', evi: 'Lab "AI for River Morphology" project, satellite-imagery DL models', c: 1 },
      { g: 'energy', lab: 'IPESE', pi: 'François Maréchal', progs: ['EDEY', 'EDCH'], kw: 'ML for industrial process & energy-system optimization', evi: '"Improved Waste Heat Management...Using a Machine Learning Approach"', c: 1 },
      { g: 'energy', lab: 'GEM', pi: 'Jan Van Herle', progs: ['EDEY'], kw: 'Deep learning / neural nets for solid oxide cell (SOFC/SOEC) characterization', evi: 'Lab site project (moderate, project-level evidence)', c: 0 },
      { g: 'energy', lab: 'PEL', pi: 'Drazen Dujic', progs: ['EDEY'], kw: 'Neural-network-inspired data-driven models for power-converter design', evi: 'Profile reference to NN-inspired models for transformer design (moderate)', c: 0 },
      { g: 'energy', lab: 'GRID-ESS', pi: 'Rahul Gupta', progs: ['EDEY'], kw: 'ML-enhanced optimization of power distribution & grid storage', evi: 'Lab description: "machine-learning-enhanced optimization of power distribution systems"', c: 1 },
      { g: 'energy', lab: 'DESL', pi: 'Mario Paolone', progs: ['EDEY'], kw: 'Deep learning for solar-irradiance forecasting', evi: 'CNN-with-memory hybrid DL model on EPFL campus webcam imagery', c: 1 },
      { g: 'energy', lab: 'WIRE', pi: 'Fernando Porté-Agel', progs: ['EDEY', 'EDCE', 'EDME'], kw: 'Hybrid NWP+ML wind/solar forecasting; deep learning for wind-farm wake modeling', evi: 'Stated lab pillar; "Offshore wind farm wake modelling using deep feed-forward NNs"', c: 1 },
      { g: 'energy', lab: 'PTMH', pi: 'Elena Vagnoni', progs: ['EDEY'], kw: 'ML for hydropower turbine start-up trajectory optimization', evi: 'Muser et al., "Fatigue damage reduction in hydropower startups with ML", Nat. Commun. 2025', c: 1 },
      { g: 'energy', lab: 'LRS — Reactor Physics and Systems Behaviour', pi: 'Andreas Pautz · Mathieu Hursin · Vincent Lamirand', progs: ['EDEY'], kw: 'ML / reduced-order surrogate modeling for reactor UQ & data assimilation', evi: 'Lab-wide stated pillar (shared across 3 members, not individual papers)', c: 0 },
      { g: 'energy', lab: 'LAMD', pi: 'Jürg Schiffmann', progs: ['EDEY', 'EDAM', 'EDME'], kw: 'ANN regression for gas/fluid-film bearing design; turbomachinery optimization', evi: 'Iseli & Schiffmann ANN bearing-force paper; DARTS-NETGAB', c: 1 },

      // ---- CIVIL / ENVIRONMENTAL ----
      { g: 'civil', lab: 'ETHOS', pi: 'Andrew Sonta', progs: ['EDCE'], kw: 'ML / data-driven modeling of human–building interaction & occupant behavior', evi: '"OccuVAE: unsupervised occupancy inference in data-driven energy modeling" (2023)', c: 1 },
      { g: 'civil', lab: 'IMOS', pi: 'Olga Fink', progs: ['EDCE', 'EDEE'], kw: 'Deep learning & physics-enhanced GNNs for fault diagnostics/prognostics', evi: 'PHM Society Fellow (2023); "From physics to machine learning and back"', c: 1 },
      { g: 'civil', lab: 'EESD', pi: 'Katrin Beyer', progs: ['EDCE'], kw: 'CNN-based crack segmentation; AI for seismic damage assessment', evi: '"Uncertainty quantification for a DL model for image-based crack segmentation" (2024)', c: 1 },
      { g: 'civil', lab: 'HOMES', pi: 'Kenan Zhang', progs: ['EDCE'], kw: 'ML/RL for autonomous vehicles & mobility-service optimization', evi: 'Stated research: "game theory and machine learning in transportation"', c: 1 },
      { g: 'civil', lab: 'RESSLab', pi: 'Dimitrios Lignos', progs: ['EDCE', 'EDME'], kw: 'Deep learning on 3D point clouds for structural damage/capacity prediction', evi: '"STEEL-3dPointClouds" dataset paper, Scientific Data (Nature, 2025)', c: 1 },
      { g: 'civil', lab: 'LMS — Soil Mechanics', pi: 'Lyesse Laloui', progs: ['EDCE'], kw: 'Data-driven ML for geomechanics & subsurface-engineering upscaling', evi: 'Ongoing ML project for geological carbon-storage upscaling', c: 1 },
      { g: 'civil', lab: 'VITA', pi: 'Alexandre Alahi', progs: ['EDCE', 'EDEE'], kw: 'Deep learning / CV for pedestrian trajectory forecasting & autonomous driving', evi: '"Social LSTM"; "Human Trajectory Forecasting in Crowds", IEEE T-ITS 2021', c: 1 },
      { g: 'civil', lab: 'CRCL', pi: 'Stefana Parascho', progs: ['EDCE', 'EDAR'], kw: 'ML for adaptive & autonomous robotic construction', evi: 'Keynote title only — no paper/pillar text found', c: 0 },
      { g: 'civil', lab: 'ECEO', pi: 'Devis Tuia', progs: ['EDCE', 'EDIC'], kw: 'Deep learning / CV for remote sensing, ecology & biodiversity monitoring', evi: '"SSL4Eco" (2025); "ML for wildlife conservation", Nat. Commun.', c: 1 },
      { g: 'civil', lab: 'TOPO', pi: 'Jan Skaloud', progs: ['EDCE'], kw: 'Photogrammetry fused with ML/deep learning for 3D mapping', evi: 'AI-based multi-scan correspondence detection, ISPRS J. Photogrammetry & RS', c: 1 },
      { g: 'civil', lab: 'LAPI', pi: 'Satoshi Takahama', progs: ['EDCE'], kw: 'Statistical / ML methods for FTIR aerosol spectral interpretation', evi: 'Combined statistical + ML estimation of organic functional groups from FTIR spectra', c: 1 },
      { g: 'civil', lab: 'LASIG', pi: 'Stéphane Joost', progs: ['EDCE'], kw: 'ML / deep learning for species-distribution modeling & landscape genomics', evi: 'R.SamBada pipeline; "Scaling species distribution models with deep learning"', c: 1 },
      { g: 'civil', lab: 'LTE', pi: 'Alexis Berne', progs: ['EDCE'], kw: 'Neural-network classification of hydrometeors/snowflakes from radar & camera data', evi: '"Vertical structure of radar reflectivity...neural networks in the Swiss Alps"; MASC classifier', c: 1 },
      { g: 'civil', lab: 'URBES', pi: 'Gabriele Manoli', progs: ['EDCE', 'EDAR'], kw: 'Graph machine learning for urban climate / microclimate forecasting', evi: '"Hourly Urban Air Temperature Forecasting with Graph Machine Learning" (2026)', c: 1 },

      // ---- MANUFACTURING ----
      { g: 'manufacturing', lab: 'LAPD', pi: 'Christophe Moser', progs: ['EDAM', 'EDMI', 'EDPO'], kw: 'Deep learning / CNNs for computational imaging through multimode optical fibers', evi: 'CNN-based image reconstruction through scrambled multimode-fiber output', c: 1 },

      // ---- CS / ROBOTICS / MATH ----
      { g: 'csrm', lab: 'AIMM', pi: 'Charlotte Bunne', progs: ['EDIC', 'EDCB'], kw: 'Deep learning / generative AI for molecular & cancer biology', evi: 'Lab pillar: "AI in Molecular Medicine" (housed at ISREC)', c: 1 },
      { g: 'csrm', lab: 'MLBIO', pi: 'Maria Brbic', progs: ['EDIC', 'EDCB'], kw: 'Deep learning for computational biology (cell-type annotation, single-cell genomics)', evi: 'Stated pillar: "AI applications in computational biology"', c: 1 },
      { g: 'csrm', lab: 'Digital Epidemiology Lab', pi: 'Marcel Salathé', progs: ['EDIC', 'EDCB'], kw: 'Network analysis / ML for epidemiological modeling; DL for plant disease', evi: 'PlantVillage deep-learning disease detection', c: 1 },
      { g: 'csrm', lab: 'Computational Neuroscience Lab', pi: 'Wulfram Gerstner', progs: ['EDIC', 'EDCB'], kw: 'Biologically grounded neural-network models of learning in the brain', evi: 'Long-standing pillar; standard computational-neuroscience textbooks', c: 1 },
      { g: 'csrm', lab: 'Mathis Group', pi: 'Alexander Mathis', progs: ['EDIC', 'EDCB'], kw: 'Deep learning for neural dynamics, proprioception & motor control', evi: 'DeepLabCut (Nat. Neurosci. 2018); "Task-driven NN models predict proprioception", Cell 2024', c: 1 },
      { g: 'csrm', lab: 'ML & AI Lab (Mathis–Weygandt Lab)', pi: 'Mackenzie Mathis', progs: ['EDIC', 'EDRS', 'EDCB'], kw: 'Deep learning for animal-behavior tracking & joint neural-behavioral analysis', evi: 'DeepLabCut; "Learnable latent embeddings for joint behavioural and neural analysis", Nature 2023', c: 1 },
      { g: 'csrm', lab: 'Computer Vision Lab (CVLab)', pi: 'Pascal Fua', progs: ['EDIC'], kw: 'Computer vision / deep learning applied to biomedical imaging', evi: 'Stated pillar, weaker/less specific evidence', c: 0 },
      { g: 'csrm', lab: 'Neuroengineering Laboratory', pi: 'Pavan Ramdya', progs: ['EDRS', 'EDCB'], kw: 'Deep learning + biomechanical simulation to reverse-engineer insect neuroscience', evi: 'DeepFly3D (2019); NeuroMechFly v2 digital-twin fly model (2024)', c: 1 },
      { g: 'csrm', lab: 'BIOROB', pi: 'Auke Ijspeert', progs: ['EDRS', 'EDEE', 'EDME'], kw: 'Computational neuroscience / ML models of animal locomotion', evi: 'Lab lists "computational neuroscience...and machine learning" as core disciplines', c: 1 },
      { g: 'csrm', lab: 'Scientific ML / Model Reduction Group', pi: 'Benjamin Peherstorfer', progs: ['EDMA'], kw: 'Scientific ML & data-driven model reduction for physical simulations', evi: '"Breaking the Kolmogorov Barrier with Nonlinear Model Reduction"', c: 1 },
      { g: 'csrm', lab: 'Swiss Plasma Center (Theory)', pi: 'Paolo Ricci', progs: ['EDMA'], kw: 'ML-based reduced-order modeling for plasma-physics simulation', evi: '"Data-driven model order reduction for accelerating boundary plasma turbulence simulations"', c: 1 },

      // ---- EE / MICROSYSTEMS / PHOTONICS ----
      { g: 'eemp', lab: 'LIS', pi: 'Dario Floreano', progs: ['EDEE', 'EDME'], kw: 'Bio-inspired AI for robotics & computational biology', evi: 'Stated pillars: "bio-inspired artificial intelligence, computational biology"', c: 1 },
      { g: 'eemp', lab: 'Psychophysics Laboratory', pi: 'Michael Herzog', progs: ['EDEE', 'EDNE'], kw: 'Neural / deep-network models of human visual perception', evi: '"Capsule networks as recurrent models of grouping and segmentation", PLOS Comp. Biol.', c: 1 },
      { g: 'eemp', lab: 'INL', pi: 'Mahsa Shoaran', progs: ['EDEE', 'EDMI', 'EDPO'], kw: 'Neuromorphic / ML hardware for neuroengineering', evi: 'Stated pillars: ML hardware, neural interfaces, neuroengineering', c: 1 },
      { g: 'eemp', lab: 'VILAB', pi: 'Amir Zamir', progs: ['EDEE'], kw: 'Computer vision / ML for robot perception', evi: 'Stated pillars', c: 1 },
      { g: 'eemp', lab: 'LASA', pi: 'Aude Billard', progs: ['EDEE'], kw: 'ML for adaptive control & human–robot interaction', evi: 'Stated pillars', c: 1 },
      { g: 'eemp', lab: 'LIMS', pi: 'Andrea Cavallaro', progs: ['EDEE'], kw: 'ML / CV for robot perception & audio processing', evi: 'Stated pillars', c: 1 },
      { g: 'eemp', lab: 'Biomedical Imaging Group', pi: 'Michael Unser', progs: ['EDEE'], kw: 'Deep learning for inverse problems in medical image reconstruction (X-ray/CT/MRI)', evi: 'IEEE Trans. Image Processing 2017 (2019 IEEE SPS Best Paper Award)', c: 1 },
      { g: 'eemp', lab: 'MRISM', pi: 'Dimitrios Karampinos', progs: ['EDEE'], kw: 'Deep learning for accelerated / robust MRI reconstruction', evi: 'DL-based coil-sensitivity / k-space reconstruction projects', c: 1 },
      { g: 'eemp', lab: 'Microwave and Antenna Group', pi: 'Anja Skrivervik', progs: ['EDEE'], kw: 'ML generative frameworks for antenna geometry design', evi: 'Conditional VAE for antenna design (Springer, 2025)', c: 1 },
      { g: 'eemp', lab: 'BNMS / AXS', pi: 'Alexandre Schmid', progs: ['EDEE', 'EDMI'], kw: 'Neuromorphic hardware for biomedical / implantable neural signal processing', evi: 'Invited talk: "Neuromorphic and Unconventional Computing...", 2023', c: 1 },
      { g: 'eemp', lab: 'SYCAMORE', pi: 'Maryam Kamgarpour', progs: ['EDEE'], kw: 'Reinforcement-learning theory for renewable energy, transportation & robotics', evi: 'Stated pillars', c: 1 },
      { g: 'eemp', lab: 'ESL', pi: 'David Atienza', progs: ['EDMI'], kw: 'Embedded / edge ML for biomedical signal processing & wearable health monitoring', evi: 'COUGHVID crowdsourced cough-ML dataset; federated learning for seizure detection', c: 1 },
      { g: 'eemp', lab: 'LSI', pi: 'Giovanni De Micheli', progs: ['EDMI'], kw: 'ML / deep learning for EDA — logic-synthesis automation', evi: '"Deep Learning for Logic Optimization Algorithms" (logic opt. as MDP via deep RL)', c: 1 },
      { g: 'eemp', lab: 'LANES', pi: 'Andras Kis', progs: ['EDMI', 'EDPO'], kw: '2D-material neuromorphic / logic-in-memory hardware for AI', evi: 'MoS₂-based artificial-neuron circuits; "Logic-in-memory based on an atomically thin semiconductor"', c: 1 },
      { g: 'eemp', lab: 'LEB', pi: 'Suliana Manley', progs: ['EDPO', 'EDCB'], kw: 'Deep learning for super-resolution / single-molecule microscopy', evi: 'Unsupervised DL framework decoding bacterial cell-cycle from super-resolved images', c: 1 },
      { g: 'eemp', lab: 'LO — Optics Laboratory', pi: 'Demetri Psaltis', progs: ['EDPO'], kw: 'Photonic / optical neural-network hardware (neuromorphic computing)', evi: '"Photonics and AI" (Advanced Photonics interview, 2024)', c: 0 },

      // ---- MECHANICS ----
      { g: 'mech', lab: 'TNE', pi: 'Silvestro Micera', progs: ['EDME', 'EDNE'], kw: 'Deep learning for neural / motor decoding', evi: '"Robust and accurate decoding of hand kinematics...using deep learning"', c: 1 },
      { g: 'mech', lab: 'ECPS', pi: 'Tobias Schneider', progs: ['EDME'], kw: 'Data-driven / generative ML for turbulence & PDE solution discovery', evi: 'Generative diffusion model discovering unknown Navier–Stokes periodic-orbit solutions', c: 1 },
      { g: 'mech', lab: 'LAMMM', pi: 'William Curtin', progs: ['EDME'], kw: 'Machine-learned interatomic potentials for materials & mechanics', evi: '"Machine learning for metallurgy" series — NN potentials for Mg, Zr', c: 1 },
      { g: 'mech', lab: 'MNS / MathICSE', pi: 'Annalisa Buffa', progs: ['EDME'], kw: 'Physics-informed ML for reduced-order modeling of PDEs', evi: '"Physics-informed machine learning for reduced-order modeling of nonlinear problems"; DeepBND', c: 1 },
      { g: 'mech', lab: 'EFML', pi: 'Pedro M. Reis', progs: ['EDME'], kw: 'Data-driven / ML models for nonlinear mechanics of metamaterials', evi: 'Public dataset released for data-driven/ML design of bistable metamaterials', c: 1 },
      { g: 'mech', lab: 'CREATE', pi: 'Josie Hughes', progs: ['EDME'], kw: 'AI-guided computational design for soft / agricultural robots', evi: 'RoboGrammar; LLM-guided design pipeline for produce-picking soft robots', c: 0 },

      // ---- COMP BIO / MOLECULAR LIFE SCI / NEUROSCIENCE ----
      { g: 'cbn', lab: 'Gönczy Lab', pi: 'Pierre Gönczy', progs: ['EDCB'], kw: 'Deep learning for microscopy image analysis & centriole detection', evi: 'CenFind, BMC Bioinformatics 2023', c: 1 },
      { g: 'cbn', lab: 'Lab of Brain Development & Biological Data Science', pi: 'Gioele La Manno', progs: ['EDCB', 'EDNE', 'EDMS'], kw: 'Computational / generative single-cell genomics; dynamical modeling of cell fate', evi: 'RNA velocity of single cells, Nature 2018', c: 1 },
      { g: 'cbn', lab: 'LTS2', pi: 'Pierre Vandergheynst', progs: ['EDCB'], kw: 'Graph neural networks applied to genomics, transcriptomics & structural biology', evi: 'REGEN (gene-network GNN); RiboGL; LD-FPG protein-structure GNN', c: 1 },
      { g: 'cbn', lab: 'LTN', pi: 'Kathryn Hess Bellwald', progs: ['EDCB', 'EDNE'], kw: 'Algebraic topology as ML-classifier input for neuron morphology (with Blue Brain)', evi: 'Topological classification of pyramidal-neuron shapes feeding ML algorithms', c: 1 },
      { g: 'cbn', lab: 'UPZenk / EpiGN', pi: 'Fides Zenk', progs: ['EDCB', 'EDMS'], kw: 'Computational / ML modeling of single-cell & spatial epigenomic trajectories', evi: 'Spatially resolved epigenomic profiling of brain organoids (bioRxiv 2022)', c: 1 },
      { g: 'cbn', lab: 'Fellay Lab / GR-FE', pi: 'Jacques Fellay', progs: ['EDCB'], kw: 'ML at the intersection of host–pathogen genomics and precision medicine', evi: 'Genome-to-genome framework; ML genomic susceptibility markers', c: 1 },
      { g: 'cbn', lab: 'Lab of Neural Genetics and Disease', pi: 'Brian McCabe', progs: ['EDCB', 'EDNE'], kw: 'ML pipeline for quantifying motor behavior in disease models', evi: '"High throughput ML pipeline...zebrafish motor behavior", bioRxiv 2025', c: 1 },
      { g: 'cbn', lab: 'UPSchueder', pi: 'Florian Schueder', progs: ['EDMS'], kw: 'Deep-learning-enabled super-resolution imaging', evi: '"Fast DNA-PAINT imaging using a deep neural network", Nat. Commun. 2022', c: 1 },
      { g: 'cbn', lab: 'LNE', pi: 'Diego Ghezzi', progs: ['EDNE'], kw: 'Machine learning for neural-prosthetic sensory encoding', evi: '"A machine learning framework that encodes images like a retina" (2024)', c: 1 },
      { g: 'cbn', lab: 'MIPLAB', pi: 'Dimitri Van De Ville', progs: ['EDNE'], kw: 'ML on brain graphs / fMRI for decoding brain states', evi: '"Machine Learning with Brain Graphs"; "Decoding Brain States from fMRI Connectivity Graphs"', c: 1 },
      { g: 'cbn', lab: 'LTS5', pi: 'Jean-Philippe Thiran', progs: ['EDNE'], kw: 'Deep learning for medical image analysis', evi: 'DL diffusion-MRI lymph-node segmentation; DL for ultrasound imaging', c: 1 },
      { g: 'cbn', lab: 'LBEM', pi: 'Henning Stahlberg', progs: ['EDNE', 'EDMS'], kw: 'Deep learning for cryo-EM structure determination', evi: 'Siamese neural network for cryo-EM projection-angle recovery', c: 1 },
      { g: 'cbn', lab: 'PTBIOEM (BioEM Facility)', pi: 'Graham Knott', progs: ['EDNE'], kw: 'Deep-learning-based large-scale EM segmentation for connectomics', evi: 'Algorithmic / DL approaches to 3D EM neuron segmentation', c: 1 },
      { g: 'cbn', lab: 'LNMC', pi: 'Henry Markram', progs: ['EDNE'], kw: 'Blue Brain Project — topology + ML-based neuron classification', evi: 'Objective algebraic-topology/ML classification of cortical neuron morphologies', c: 1 },
      { g: 'cbn', lab: 'BBP-CORE', pi: 'Sean Hill', progs: ['EDNE'], kw: 'Computational modeling, ML & data science for brain disorders', evi: 'Krembil Centre for Neuroinformatics', c: 1 },
      { g: 'cbn', lab: 'BBP-CORE', pi: 'Felix Schürmann', progs: ['EDNE'], kw: 'Deep learning for aligning / registering large-scale brain datasets', evi: 'Blue Brain deep-learning gene-expression dataset registration tool', c: 1 },
      { g: 'cbn', lab: 'UPHUMMEL', pi: 'Friedhelm Hummel', progs: ['EDNE'], kw: 'ML + connectomics for clinical outcome prediction', evi: 'ML system combining connectome data to predict stroke recovery', c: 1 },
      { g: 'cbn', lab: 'LPBS', pi: 'Sahand Jamal Rahi', progs: ['EDNE'], kw: 'Deep learning for cell/organism image analysis & neural tracking', evi: 'ML yeast-cell segmentation/tracking; NN pipeline for 4D C. elegans neuron tracking; co-author of CenFind', c: 1, note: 'Same lab was screened as EXCLUDED under the earlier EDBB pass — flagged as a reconciliation point.' },

      // ---- ARCHITECTURE / DIGITAL HUMANITIES ----
      { g: 'archhum', lab: 'LDM — Media x Design Lab', pi: 'Jeffrey Huang', progs: ['EDAR'], kw: 'GANs / latent-space methods for generative architectural design', evi: '"Design Brain" (Seoul Biennale) — DL-generated Alpine architecture', c: 1 },
      { g: 'archhum', lab: 'DHLab', pi: 'Frédéric Kaplan', progs: ['EDAR', 'EDDH'], kw: 'Historical NLP/OCR, ML-based 4D urban reconstruction, historical-map CV', evi: 'dhSegment; Venice Time Machine; ICDAR 2026 HIPE-OCRepair', c: 1 },
      { g: 'archhum', lab: 'CEAT', pi: 'Jérôme Chenal', progs: ['EDAR'], kw: 'ML for urban-form indicators & planning decision-support', evi: '"Reviewing ML methods to model urban form indicators..." (2021)', c: 1 },
      { g: 'archhum', lab: 'HOBEL', pi: 'Dušan Licina', progs: ['EDAR'], kw: 'Explainable AI for building-energy benchmarking', evi: '"Bench2X" two-stage XAI framework (2026)', c: 1 },
      { g: 'archhum', lab: 'SXL', pi: 'Corentin Fivet', progs: ['EDAR'], kw: 'Spatiotemporal ML for building-stock demolition/reuse risk', evi: '"Spatiotemporal machine learning for building demolition risk modelling" (2026)', c: 1 },
      { g: 'archhum', lab: 'IBOIS', pi: 'Yves Weinand', progs: ['EDAR'], kw: 'Computer-vision-assisted, AI-informed timber fabrication', evi: '"Augmented Carpentry" (2025)', c: 1 },
      { g: 'archhum', lab: 'HERUS', pi: 'Claudia Binder', progs: ['EDAR'], kw: 'ML-augmented urban metabolism/emissions analysis; CV object-tracking of public space', evi: '"ML augmented global analysis of urban emission trends 2010–2022"', c: 0, note: 'Conflicting screen: excluded under the EDCE pass (core pillars = Bayesian Networks/ABM, not ML) but confirmed under the EDAR pass — treat as borderline either way.' },
      { g: 'archhum', lab: 'EM+ — Experimental Museology', pi: 'Sarah Kenderdine', progs: ['EDAR', 'EDDH'], kw: '"Computational museology" — ML/CV/visual analytics for cultural heritage', evi: 'CROSSINGS project (knowledge-graph/ML modeling of intangible heritage)', c: 1 },
      { g: 'archhum', lab: 'Idiap / Social Computing Group', pi: 'Daniel Gatica-Perez', progs: ['EDDH'], kw: 'CNN-based ancient-glyph decipherment; computational social science', evi: '"How to Tell Ancient Signs Apart? Recognizing Maya Glyphs" (2018, MAAYA project)', c: 1 },
      { g: 'archhum', lab: 'DCML', pi: 'Martin Rohrmeier', progs: ['EDDH'], kw: 'Computational modeling of musical structure & style', evi: '"Distant Listening – Transitions of Tonality" (SNSF); "From Bach to the Beatles" (VW Foundation)', c: 1 },
      { g: 'archhum', lab: 'LHST', pi: 'Jérôme Baudry', progs: ['EDDH'], kw: 'Computational / digital history, distant reading, algorithmic trail analysis', evi: '"Querying the Digital Archive of Science"', c: 1 },

      // ---- FINANCE / MGMT / EDUCATION ----
      { g: 'fme', lab: 'SFI Chair of Computational Finance', pi: 'Damir Filipovic', progs: ['EDFI'], kw: 'ML / neural nets for portfolio pricing, risk management & volatility prediction', evi: '"A machine learning approach to portfolio pricing and risk management..." (2022)', c: 1 },
      { g: 'fme', lab: 'SFI Chair', pi: 'Semyon Malamud', progs: ['EDFI'], kw: 'Deep learning / high-dim ML for asset pricing & stochastic discount factors', evi: '"Artificial Intelligence Asset Pricing Models", NBER WP 2025', c: 1 },
      { g: 'fme', lab: 'SFI Chair', pi: 'Andreas Fuster', progs: ['EDFI'], kw: 'ML applied to credit markets & fintech lending', evi: '"Predictably Unequal? The Effects of ML on Credit Markets", J. Finance 2022 (Brattle Prize)', c: 1 },
      { g: 'fme', lab: 'TIP — Innovation and IP Policy Lab', pi: 'Gaétan de Rassenfosse', progs: ['EDMT'], kw: 'NLP / text-embedding ML applied to patent data for innovation & IP analysis', evi: '"Text-Embedding-based Approach to Measure Patent-to-Patent Technological Similarity" (2022)', c: 1 },
      { g: 'fme', lab: 'TOM', pi: 'Ralf Seifert', progs: ['EDMT'], kw: 'Deep neural networks for new-product sales forecasting', evi: '"ML-based framework for forecasting sales of new products...using DNNs" (2022)', c: 1 },
      { g: 'fme', lab: 'ML4ED', pi: 'Tanja Käser', progs: ['JDPLS'], kw: 'ML / data mining for student modeling, knowledge tracing & fairness in ed-tech', evi: 'Lab mission: algorithmic student-knowledge estimation and fairness', c: 1 },
      { g: 'fme', lab: 'Human-AI Collaboration Unit', pi: 'Ken Holstein', progs: ['JDPLS'], kw: 'Human-AI complementarity; AI-driven classroom orchestration & analytics', evi: '"Designing for human-AI complementarity in K-12 education", AI Magazine 2022; Lumilo', c: 1 },
      { g: 'fme', lab: 'REACT / Graasp', pi: 'Denis Gillet', progs: ['JDPLS'], kw: 'Learning-analytics infrastructure; explainable AI on educational data', evi: '"An End-to-End Data Pipeline for Managing Learning Analytics"; GraphNEx', c: 1 },
      { g: 'fme', lab: 'CePro', pi: 'Simone Deparis', progs: ['JDPLS'], kw: 'Context-aware generative AI / fine-tuned LLMs supporting instructors', evi: '"AI Meets Mathematics Education: Supporting an Instructor with Context-Aware AI", CHI 2026', c: 1 },
    ],
  },
  {
    id: 'eth',
    name: 'ETH Zurich',
    fullName: 'Eidgenössische Technische Hochschule Zürich',
    location: 'Zurich, Switzerland',
    programsUrl: 'https://ethz.ch/en/doctorate/doctoral-study-programmes.html',
    blurb:
      'ETH doesn’t run EPFL-style numbered doctoral programs — doctorates are organized by 16 departments. Professorships across those departments screened for a genuine, evidence-backed machine-learning / AI component applied to a science or engineering domain.',
    groups: [
      { key: 'ai4bio', label: 'AI4Bio — Biosystems Science & Biology', code: 'D-BSSE · D-BIOL', tone: 'bio' },
      { key: 'health', label: 'Health Sciences and Technology', code: 'D-HEST', tone: 'bio' },
      { key: 'chem', label: 'Chemistry and Applied Biosciences', code: 'D-CHAB', tone: 'sci' },
      { key: 'materials', label: 'Materials', code: 'D-MATL', tone: 'sci' },
      { key: 'physics', label: 'Physics', code: 'D-PHYS', tone: 'sci' },
      { key: 'earthenv', label: 'Earth, Planetary & Environmental Systems Science', code: 'D-EAPS · D-USYS', tone: 'sci' },
      { key: 'civil', label: 'Civil, Environmental and Geomatic Engineering', code: 'D-BAUG', tone: 'sci' },
      { key: 'arch', label: 'Architecture', code: 'D-ARCH', tone: 'soft' },
      { key: 'csmath', label: 'Computer Science & Mathematics', code: 'D-INFK · D-MATH', tone: 'sci' },
      { key: 'eemech', label: 'Electrical Eng. & Mechanical/Process Engineering', code: 'D-ITET · D-MAVT', tone: 'sci' },
      { key: 'mtec', label: 'Management, Technology, and Economics', code: 'D-MTEC', tone: 'soft' },
      { key: 'gess', label: 'Humanities, Social and Political Sciences', code: 'D-GESS', tone: 'soft' },
    ],
    rows: [
      // ---- AI4BIO: D-BSSE ----
      { g: 'ai4bio', lab: 'Computational Biology Group', pi: 'Niko Beerenwinkel', progs: ['D-BSSE'], kw: 'Statistical/ML models for cancer & viral evolution genomics', evi: 'Stated pillar: statistical/evolutionary/network modeling for oncology/virology; "Bayesian inference of fitness landscapes…" (Bioinformatics 2025)', c: 1 },
      { g: 'ai4bio', lab: 'Computational Medical Genomics', pi: 'Na Cai', progs: ['D-BSSE'], kw: 'ML/statistical-genetics models for psychiatric disease risk (MDD)', evi: 'New computational models to assess MDD genetic risk; ETH AI Center faculty', c: 1 },
      { g: 'ai4bio', lab: 'Medical AI Lab', pi: 'Michael Moor', progs: ['D-BSSE'], kw: 'Medical foundation models, LLM agents for clinical reasoning', evi: 'Lab named "Medical AI Lab"; "Foundation models for generalist medical AI" (Nature 2023); Med-Flamingo', c: 1 },
      { g: 'ai4bio', lab: 'Laboratory for Systems and Synthetic Immunology', pi: 'Sai Reddy', progs: ['D-BSSE'], kw: 'Deep learning / protein language models for antibody engineering', evi: 'FcGPT (autoregressive protein LM for Fc variants); CALM cross-attention Ab–antigen language model (2026 preprint)', c: 1 },
      { g: 'ai4bio', lab: 'Computer-Assisted Drug Design', pi: 'Gisbert Schneider', progs: ['D-BSSE'], kw: 'Generative AI / ML for de novo drug design', evi: 'Stated focus: ML for virtual screening and de novo design; "Generative molecular design in low data regimes"', c: 1 },
      { g: 'ai4bio', lab: 'Cell Systems Dynamics Group', pi: 'Timm Schroeder', progs: ['D-BSSE'], kw: 'Deep learning for live-cell tracking & segmentation', evi: 'aiSEGcell (PLOS Comp. Biol. 2024); Caliban cell-tracking DL tools', c: 1 },
      { g: 'ai4bio', lab: 'Quantitative Developmental Biology Lab', pi: 'Barbara Treutlein', progs: ['D-BSSE'], kw: 'ML-driven single-cell genomics of organoid development', evi: 'ML interpretation of 20k-gene single-cell datasets; Human Cell Atlas computational work', c: 1 },
      { g: 'ai4bio', lab: 'Biomolecular Design Lab', pi: 'Basile Wicky', progs: ['D-BSSE'], kw: 'Deep-learning generative protein design', evi: 'Ex-Baker lab (RFdiffusion lineage); reinforcement learning for protein backbone design', c: 1 },
      { g: 'ai4bio', lab: 'Multicellular Systems Lab', pi: 'Prisca Liberali', progs: ['D-BSSE'], kw: 'AI-driven bioimage analysis of organoid self-organization', evi: 'AI-driven bioimage analysis pipelines for digital-organoid, single-cell-to-tissue modeling', c: 1 },
      // ---- AI4BIO: D-BIOL ----
      { g: 'ai4bio', lab: 'Beltrao Group (IMSB)', pi: 'Pedro Beltrao', progs: ['D-BIOL'], kw: 'ML for phosphosite function & protein-interaction structure prediction', evi: 'Nested regression/ML for phosphosite function; AlphaFold2-based structural prediction for 65,484 human PPIs (Nat. Struct. Mol. Biol.)', c: 1 },
      { g: 'ai4bio', lab: 'Bodenmiller Lab (IMHS)', pi: 'Bernd Bodenmiller', progs: ['D-BIOL'], kw: 'Deep learning for tumor-tissue image & mass-cytometry analysis', evi: 'Recruits for "deep learning…tumor-tissue image analysis"; imaging mass cytometry + computational phenotyping', c: 1 },
      { g: 'ai4bio', lab: 'Sunagawa Lab (Institute of Microbiology)', pi: 'Shinichi Sunagawa', progs: ['D-BIOL'], kw: 'ML for metagenomics / microbiome classification', evi: 'SIAMCAT — ML toolbox for microbiome meta-analysis and cross-disease comparison', c: 1 },
      { g: 'ai4bio', lab: 'Pilhofer Lab', pi: 'Martin Pilhofer', progs: ['D-BIOL'], kw: 'Deep learning for cryo-electron tomography particle picking', evi: 'MemBrain (CNN membrane-protein detection); TomoTwin (deep metric-learning particle localization, Nat. Methods 2023)', c: 1 },
      { g: 'ai4bio', lab: 'Picotti Group (IMSB)', pi: 'Paola Picotti', progs: ['D-BIOL'], kw: 'ML-based chemoproteomics (secondary to core LiP-MS method)', evi: '"A machine learning-based chemoproteomic approach to identify drug targets…" (Nat. Commun. 2020) — single project, not a lab-wide pillar', c: 0 },

      // ---- HEALTH: D-HEST ----
      { g: 'health', lab: 'Bokulich Lab', pi: 'Nicholas Bokulich', progs: ['D-HEST'], kw: 'ML for food / gut microbiome classification', evi: 'Co-developed q2-sample-classifier (QIIME2 ML plugin)', c: 1 },
      { g: 'health', lab: 'Biomedical and Mobile Health Technology Lab', pi: 'Carlo Menon', progs: ['D-HEST'], kw: 'ML for wearable sensor & biosignal processing', evi: 'Lab page: "integrates machine learning, sensor technologies, and user-centered design"', c: 1 },
      { g: 'health', lab: 'Biomedical Data Science Lab / Spinal Cord Injury & AI Lab', pi: 'Catherine Jutzeler', progs: ['D-HEST'], kw: 'ML/AI for clinical outcome prediction in spinal cord injury', evi: 'Lab explicitly named "Spinal Cord Injury & Artificial Intelligence Lab"', c: 1 },
      { g: 'health', lab: 'Mechano-Genomics Group (IMTM)', pi: 'G.V. Shivashankar', progs: ['D-HEST'], kw: 'AI-based image biomarkers for chromatin / nuclear architecture', evi: '"AI-based Chromatin Imaging Biomarkers in Health and Disease"; graph-based autoencoder for spatial transcriptomics', c: 1 },
      { g: 'health', lab: 'Wollscheid Group (Biomedical Proteomics)', pi: 'Bernd Wollscheid', progs: ['D-HEST'], kw: 'ML-based surfaceome protein classification', evi: 'SURFY — machine-learning surfaceome predictor tool', c: 0 },

      // ---- CHEMISTRY: D-CHAB ----
      { g: 'chem', lab: 'Digital Chemistry Laboratory', pi: 'Kjell Jorner', progs: ['D-CHAB'], kw: 'Generative ML / diffusion models for catalyst & molecular design', evi: 'Stated pillar: "generative models for catalysis"; teaches "Digital Chemistry" course (2025)', c: 1 },
      { g: 'chem', lab: 'Computational Chemistry', pi: 'Sereina Riniker', progs: ['D-CHAB'], kw: 'ML for conformer generation, crystal packing, MD/ML hybrid methods', evi: 'GeoMol / CoarsenConf conformer-generation papers; ML+MD for P-glycoprotein substrate prediction', c: 1 },
      { g: 'chem', lab: 'Theoretical Chemistry', pi: 'Markus Reiher', progs: ['D-CHAB'], kw: 'ML interatomic potentials for autonomous reaction-network exploration', evi: '"Lifelong Machine Learning Potentials for Chemical Reaction Network Explorations" (JCTC 2025)', c: 1 },
      { g: 'chem', lab: 'Catalysis Engineering', pi: 'Javier Pérez-Ramírez', progs: ['D-CHAB'], kw: 'AI/ML for catalyst discovery & descriptor identification', evi: '"Identifying Descriptors for Promoted Rh-Based Catalysts…via ML" (ACS Catal. 2023); Explainable AI for nanocatalysts (Adv. Mater. 2025)', c: 1 },
      { g: 'chem', lab: 'Functional Inorganic Materials', pi: 'Maksym Kovalenko', progs: ['D-CHAB'], kw: 'Deep learning for nanocrystal / materials synthesis', evi: '"Deep Learning Models for Colloidal Nanocrystal Synthesis" (2024)', c: 1 },
      { g: 'chem', lab: 'Biochemical Engineering', pi: 'Andrew deMello', progs: ['D-CHAB'], kw: 'ML-driven autonomous microfluidic discovery', evi: 'CascadeMAP — autonomous closed-loop enzyme-cascade optimization via microfluidics + ML + agentic AI', c: 1 },
      { g: 'chem', lab: 'Biochemical Engineering', pi: 'Paolo Arosio', progs: ['D-CHAB'], kw: 'ML for protein aggregation / biologics formulation', evi: '"Experimentally validated deep learning control of protein aggregation" (Commun. Chem. 2026)', c: 1 },
      { g: 'chem', lab: 'Biological NMR Spectroscopy', pi: 'Roland Riek', progs: ['D-CHAB'], kw: 'Deep learning for automated NMR protein structure determination', evi: 'ARTINA — deep-learning technique for protein structures from raw NMR spectra (Nat. Commun. 2022)', c: 1 },
      { g: 'chem', lab: 'Surface & Interface Engineering of Nanomaterials', pi: 'Chih-Jen Shih', progs: ['D-CHAB'], kw: 'ML-assisted materials / polymer property exploration', evi: '"ML-assisted Exploration of a Universal Polymer Platform with Charge Transfer-dependent…Emission"', c: 1 },
      { g: 'chem', lab: 'Battery Materials', pi: 'Sarbajit Banerjee', progs: ['D-CHAB'], kw: 'ML interatomic potentials for battery / electrode materials', evi: '"Machine Learning for Electrode Materials: Property Prediction via Composition" (2026)', c: 1 },

      // ---- MATERIALS: D-MATL ----
      { g: 'materials', lab: 'Materials Modeling', pi: 'Malik Wagih', progs: ['D-MATL'], kw: 'ML + physics-based simulation for materials discovery in extreme environments', evi: 'Stated pillar: group "combines theory, physics-based simulations, machine learning, and autonomous workflows"', c: 1 },
      { g: 'materials', lab: 'Materials Theory', pi: 'Nicola Spaldin', progs: ['D-MATL'], kw: 'ML-enabled first-principles materials prediction (ML secondary to core theory identity)', evi: '"Machine Learning-Enabled Ab Initio Study of the Isotope Effect" (PRL); ML for ferroelectric materials (2026)', c: 0 },

      // ---- PHYSICS: D-PHYS ----
      { g: 'physics', lab: 'LEAP Lab', pi: 'Thea Aarrestad', progs: ['D-PHYS'], kw: 'Real-time ML/DL for high-energy physics; FPGA inference, anomaly detection', evi: 'Co-developed hls4ml (ML→FPGA deployment for CERN LHC); ERC Starting Grant', c: 1 },
      { g: 'physics', lab: 'Cosmology Group', pi: 'Alexandre Refregier', progs: ['D-PHYS'], kw: 'Deep learning for cosmological inference from weak lensing', evi: '"Cosmological constraints with deep learning from KiDS-450 weak lensing maps" (PRD 2019)', c: 1 },
      { g: 'physics', lab: 'Computational Physics / Lattice Theory', pi: 'Marina Krstic Marinkovic', progs: ['D-PHYS'], kw: 'ML sampling (normalizing flows / diffusion) for lattice QCD', evi: '"Stochastic normalizing flows for lattice field theory" (2022); "Group-equivariant diffusion models for lattice field theory" (2025)', c: 1 },
      { g: 'physics', lab: 'Computational Physics Group', pi: 'Juan Carrasquilla', progs: ['D-PHYS'], kw: 'Neural-network quantum states, ML for quantum many-body phases', evi: 'NN quantum state tomography (Nature Physics); "Connectivity determines the capability of sparse NN quantum states" (2026)', c: 1 },
      { g: 'physics', lab: 'Gravitational Physics Group', pi: 'Michele Vallisneri', progs: ['D-PHYS'], kw: 'Deep learning for gravitational-wave inference / detection', evi: '"Learning Bayesian Posteriors with Neural Networks for Gravitational-Wave Inference" (PRL 2020)', c: 1 },
      { g: 'physics', lab: 'Exoplanet Interiors & Atmospheres', pi: 'Caroline Dorn', progs: ['D-PHYS'], kw: 'ML / surrogate models for exoplanet interior retrieval', evi: '"ExoMDN: Rapid characterization of exoplanet interior structures with Mixture Density Networks" (2023)', c: 1 },
      { g: 'physics', lab: 'Exoplanets & Habitability Group', pi: 'Sascha Quanz', progs: ['D-PHYS'], kw: 'CNN / deep learning for direct-imaging exoplanet detection', evi: '"Deep learning for exoplanet detection and characterization by direct imaging" (2025)', c: 1 },
      { g: 'physics', lab: 'Nanophysics Group', pi: 'Klaus Ensslin & Thomas Ihn', progs: ['D-PHYS'], kw: 'ML / neural nets for autonomous quantum-dot device tuning', evi: '"Machine learning enables completely automatic tuning of a quantum device faster than human experts" (2020)', c: 1 },

      // ---- EARTH/ENV: D-EAPS, D-USYS ----
      { g: 'earthenv', lab: 'Swiss Seismological Service (SED) / Seismology', pi: 'Stefan Wiemer', progs: ['D-EAPS'], kw: 'ML for earthquake detection, phase-picking, seismic hazard', evi: 'Public ML research statement; SED data underlies "SeisLM: a Foundation Model for Seismic Waveforms" (2024)', c: 1 },
      { g: 'earthenv', lab: 'Geothermal Energy and Geofluids (GEG)', pi: 'Martin O. Saar', progs: ['D-EAPS'], kw: 'ML-accelerated geochemical / geothermal reactive-transport simulation', evi: 'On-demand ML (ODML) module in Reaktoro; SNF grant for "ultra-fast simulations…using ML and GPU parallel computing"', c: 1 },
      { g: 'earthenv', lab: 'Crop Science Group (IAS)', pi: 'Achim Walter', progs: ['D-USYS'], kw: 'ML / computer vision for high-throughput field phenotyping', evi: '"Outdoor Plant Segmentation With Deep Learning for High-Throughput Field Phenotyping" (2022); YOLOv8 ETH Field Imaging Platform', c: 1 },
      { g: 'earthenv', lab: 'Ecosystems and Landscape Evolution (ITES)', pi: 'Loïc Pellissier', progs: ['D-USYS'], kw: 'Deep learning for species distribution modeling / biodiversity mapping', evi: '"Multi-scale neural networks enhance species distribution modelling across predictors and taxonomic groups" (2025)', c: 1 },
      { g: 'earthenv', lab: 'Environmental Physics Group (IAC)', pi: 'Nicolas Gruber', progs: ['D-USYS'], kw: 'ML-based ocean carbon-flux mapping', evi: 'OceanSODA-ETHZ ML gap-filling product for surface-ocean CO2/carbonate system (2024)', c: 1 },
      { g: 'earthenv', lab: 'Climate Physics Group (IAC)', pi: 'Reto Knutti', progs: ['D-USYS'], kw: 'Uses ML climate emulators, but core pillar is climate-model uncertainty/observational constraints', evi: 'Vocal advocate and user of ML climate emulators; stated pillar is not ML-first', c: 0 },

      // ---- CIVIL: D-BAUG ----
      { g: 'civil', lab: 'Structural Mechanics and Monitoring', pi: 'Eleni Chatzi', progs: ['D-BAUG'], kw: 'Physics-enhanced ML for structural health monitoring, digital twins, nonlinear system ID', evi: 'Group research page: "Scientific Machine Learning for Structural Identification"', c: 1 },
      { g: 'civil', lab: 'Photogrammetry and Remote Sensing', pi: 'Konrad Schindler', progs: ['D-BAUG'], kw: 'Deep learning / computer vision for 3D reconstruction, remote sensing, mapping', evi: 'Long-standing CV/DL program (semantic segmentation, point-cloud DL)', c: 1 },
      { g: 'civil', lab: 'Risk, Safety and Uncertainty Quantification', pi: 'Bruno Sudret', progs: ['D-BAUG'], kw: 'ML/AI surrogate modeling (Kriging, SVM, PCE) for reliability & UQ', evi: 'Group page "Surrogate modeling and artificial intelligence"; develops UQLab', c: 1 },
      { g: 'civil', lab: 'Space Geodesy', pi: 'Benedikt Soja', progs: ['D-BAUG'], kw: 'ML for GNSS/VLBI processing, geophysical signal detection', evi: 'Chairs GGOS Focus Area "AI for Geodesy"', c: 1 },
      { g: 'civil', lab: 'Computational Mechanics of Building Materials', pi: 'David Kammer', progs: ['D-BAUG'], kw: 'ML / data-driven fracture and solid mechanics', evi: '"Reduced-Order Modeling through ML for Brittle Fracture" (2018); "Data-driven fracture mechanics" (2020)', c: 1 },
      { g: 'civil', lab: 'Earth Observation and Remote Sensing', pi: 'Irena Hajnsek', progs: ['D-BAUG'], kw: 'ML (random forest) on multi-frequency SAR for classification/inversion', evi: 'Random-forest sea-ice classification on SAR imagery', c: 1 },
      { g: 'civil', lab: 'Geosensors and Engineering Geodesy', pi: 'Andreas Wieser', progs: ['D-BAUG'], kw: 'Deep learning for point-cloud deformation monitoring', evi: 'F2S3 deep-learning algorithm; ML-in-geodesy tutorials', c: 1 },
      { g: 'civil', lab: 'Geoinformation Engineering', pi: 'Martin Raubal', progs: ['D-BAUG'], kw: 'Deep generative models & interpretable ML for human mobility', evi: '"MobilityGen" deep generative trajectory model; SNF causal-ML mobility project', c: 1 },
      { g: 'civil', lab: 'Circular Engineering for Architecture', pi: 'Catherine De Wolf', progs: ['D-BAUG'], kw: 'ML/CV on urban imagery for building-material reuse prediction', evi: 'ML on historical photos / Streetview to predict façade disassembly/reuse', c: 1 },
      { g: 'civil', lab: 'Traffic Engineering', pi: 'Anastasios Kouvelas', progs: ['D-BAUG'], kw: 'RL / neural nets for traffic signal & perimeter control', evi: '"Antifragile perimeter control with reinforcement learning"', c: 1 },
      { g: 'civil', lab: 'Infrastructure Management', pi: 'Bryan Adey', progs: ['D-BAUG'], kw: 'Deep learning for infrastructure condition / maintenance prediction', evi: 'Stated pillar "deep learning for condition assessment & maintenance planning"', c: 1 },
      { g: 'civil', lab: 'Cartography', pi: 'Lorenz Hurni', progs: ['D-BAUG'], kw: 'Deep learning for historical map digitization & generalization', evi: '"Deep learning enables urban change profiling through alignment of historical maps"; MapSAM', c: 1 },
      { g: 'civil', lab: 'Alpine Mass Movements', pi: 'Johan Gaume', progs: ['D-BAUG'], kw: 'ML for avalanche forecasting', evi: '"THIRST" doctoral project — ML models for spatiotemporal avalanche forecasting', c: 1 },
      { g: 'civil', lab: 'Transport Systems', pi: 'Francesco Corman', progs: ['D-BAUG'], kw: 'Deep learning / AI for railway delay propagation', evi: '"Deep Learning to Identify Spatio-Temporal Cascading Effects of Train Delays" (2025)', c: 1 },
      { g: 'civil', lab: 'Structural Dynamics and Earthquake Engineering', pi: 'Bozidar Stojadinovic', progs: ['D-BAUG'], kw: 'ML damage classification for rapid seismic loss assessment', evi: 'ML-based damage-classification framework; RELAR project (ML + image recognition)', c: 1 },
      { g: 'civil', lab: 'Concrete Structures and Bridge Design', pi: 'Walter Kaufmann', progs: ['D-BAUG'], kw: 'ML/AI surrogate models for structural analysis (Design++)', evi: 'AI trained on parametric bridge FE analyses; "Differentiable Material Surrogate Model for RC Membranes" (2026)', c: 1 },
      { g: 'civil', lab: 'Air Quality and Particle Technology', pi: 'Jing Wang', progs: ['D-BAUG'], kw: 'Interpretable ML for aerosol / air-quality data', evi: 'Advertises theses on "Interpretable Machine Learning Methods in Air Quality"', c: 0 },
      { g: 'civil', lab: 'Hydrology and Fluvial Systems', pi: 'Peter Molnar', progs: ['D-BAUG'], kw: 'ML applied to hydrological forecasting', evi: 'Co-led Google "Flood Forecasting Meets ML" workshop sessions', c: 0 },
      { g: 'civil', lab: 'Urban Water Systems', pi: 'Max Maurer', progs: ['D-BAUG'], kw: 'Data-driven / ML methods for urban water management', evi: '"The Potential of Knowing More: A Review of Data-Driven Urban Water Management"', c: 0 },
      { g: 'civil', lab: 'Hydrology and River Systems Science', pi: 'Paola Passalacqua', progs: ['D-BAUG'], kw: 'ML for river-network representation', evi: 'Invited AGU26 session "Advancing River Network Representation in Physical and ML Models"', c: 0 },

      // ---- ARCHITECTURE: D-ARCH ----
      { g: 'arch', lab: 'Computational Design Laboratory', pi: 'Bernd Bickel', progs: ['D-ARCH'], kw: 'ML / deep learning for computational design & fabrication', evi: 'ETH AI Center faculty; lab teaches "scientific machine and deep learning"; Center for Augmented Computational Design', c: 1 },
      { g: 'arch', lab: 'Architecture and Digital Fabrication (Gramazio Kohler Research)', pi: 'Fabio Gramazio & Matthias Kohler', progs: ['D-ARCH'], kw: 'AI-augmented generative / robotic design', evi: '"AIXD: AI-eXtended Design"; "Architectural Design with Conditional Autoencoders" (2021)', c: 1 },
      { g: 'arch', lab: 'Architecture and Building Systems', pi: 'Arno Schlüter', progs: ['D-ARCH'], kw: 'ML for building energy management / control', evi: 'Group publications: "Building energy management increasingly utilises Machine Learning…from sensor-rich environments"', c: 1 },
      { g: 'arch', lab: 'Architecture and Human Augmentation', pi: 'Daniela Mitterberger', progs: ['D-ARCH'], kw: 'AI / robotics for human-augmented fabrication and extended reality', evi: 'Keynote "Intuitive Machines & Extended Realities"; Design++ affiliate (no explicit ML pillar on own site)', c: 0 },
      { g: 'arch', lab: 'Structural Design', pi: 'Jacqueline Pauli', progs: ['D-ARCH'], kw: 'ML for structural / bridge assessment', evi: '"Predictive Structural Assessment of Concrete Frame Bridges using [ML]"; Design++ affiliate', c: 0 },

      // ---- CS + MATH: D-INFK, D-MATH ----
      { g: 'csmath', lab: 'Computational Cancer Genomics', pi: 'Valentina Boeva', progs: ['D-INFK'], kw: 'ML/statistics for multi-omics cancer data integration', evi: 'ML methods for transcriptional heterogeneity/plasticity in cancer', c: 1 },
      { g: 'csmath', lab: 'Biomedical Informatics Group', pi: 'Gunnar Rätsch', progs: ['D-INFK'], kw: 'ML for genomics, cancer, clinical time series', evi: 'Genome-graph methods in PCAWG (Nature 2020); generative models for ICU early-warning systems', c: 1 },
      { g: 'csmath', lab: 'Medical Data Science Group', pi: 'Julia Vogt', progs: ['D-INFK'], kw: 'ML for clinical data / precision medicine', evi: 'Stated focus: "new machine learning techniques for clinical data analysis and precision medicine"', c: 1 },
      { g: 'csmath', lab: 'Learning & Adaptive Systems (LAS)', pi: 'Andreas Krause', progs: ['D-INFK'], kw: 'ML applied to science/engineering: sustainability, drug discovery, environmental monitoring', evi: 'Stated pillar: "AI methods to bear on important problems in science and engineering"; Bayesian optimization for drug discovery', c: 1 },
      { g: 'csmath', lab: 'Empirical Inference (ETH / MPI-IS)', pi: 'Bernhard Schölkopf', progs: ['D-INFK'], kw: 'Causal ML applied to astronomy / biomedicine', evi: '"Removing systematic errors for exoplanet search via latent causes" (ICML 2015) — contributed to K2-18b exoplanet discovery', c: 0 },
      { g: 'csmath', lab: 'Seminar for Applied Mathematics (SAM)', pi: 'Siddhartha Mishra', progs: ['D-MATH'], kw: 'Scientific machine learning, physics-informed neural networks, neural operators', evi: 'Fourier/deep operator networks with proven approximation rates; PINN error bounds for Navier–Stokes; self-described "AI for Science"', c: 1 },
      { g: 'csmath', lab: 'Seminar for Applied Mathematics (SAM)', pi: 'Christoph Schwab', progs: ['D-MATH'], kw: 'Deep learning theory for PDEs', evi: 'Deep operator networks (ONets) with exponential convergence rates for elliptic PDE coefficient-to-solution maps', c: 1 },
      { g: 'csmath', lab: 'Seminar for Statistics', pi: 'Peter Bühlmann', progs: ['D-MATH'], kw: 'Causal inference / statistical ML for computational biology', evi: '"Methods for causal inference from gene perturbation experiments and validation" (PNAS 2016)', c: 1 },
      { g: 'csmath', lab: 'Seminar for Statistics', pi: 'Jonas Peters', progs: ['D-MATH'], kw: 'Causal inference for Earth system science', evi: '"Assimilative Causal Inference" (arXiv 2025); causal-inference methods for climate variability/extremes', c: 1 },

      // ---- EE + MECH: D-ITET ----
      { g: 'eemech', lab: 'Integrated Systems Laboratory', pi: 'Laura Bégon-Lours', progs: ['D-ITET'], kw: 'Neuromorphic devices, artificial synapses/neurons (ML hardware)', evi: 'Group focus: "Neuromorphic Devices, Artificial Synapses and Neurons, Functional Oxides, Ferroelectrics"', c: 1 },
      { g: 'eemech', lab: 'Integrated Systems Laboratory', pi: 'Luca Benini', progs: ['D-ITET'], kw: 'ML on embedded/edge systems, low-power AI hardware', evi: 'Stated pillar includes machine learning, autonomous driving, brain-machine interfaces', c: 1 },
      { g: 'eemech', lab: 'Professorship for Mathematical Information Science', pi: 'Helmut Bölcskei', progs: ['D-ITET'], kw: 'ML theory, mathematical foundations of deep learning', evi: 'Stated pillar: "machine learning theory, mathematical signal processing"', c: 1 },
      { g: 'eemech', lab: 'Institute of Neuroinformatics', pi: 'Benjamin Grewe', progs: ['D-ITET'], kw: 'Learning algorithms in bio/artificial neural circuits', evi: 'Stated pillar: "learning algorithms in biological and artificial neuronal networks"', c: 1 },
      { g: 'eemech', lab: 'Institute of Neuroinformatics', pi: 'Richard Hahnloser', progs: ['D-ITET'], kw: 'Self-supervised ML for neuroethology (songbird vocal learning)', evi: 'Self-supervised multimodal learning technique for songbird vocalization detection', c: 1 },
      { g: 'eemech', lab: 'Institute of Neuroinformatics', pi: 'Giacomo Indiveri', progs: ['D-ITET'], kw: 'Neuromorphic mixed-signal circuits for spiking neural networks', evi: 'Group focus: mixed-signal circuits for spiking neural networks and autonomous agents', c: 1 },
      { g: 'eemech', lab: 'Energy-Efficient Circuits and IoT Systems', pi: 'Taekwang Jang', progs: ['D-ITET'], kw: 'ML-oriented circuit design (in-memory computing, on-sensor classification)', evi: 'Research interests list image classification, energy-efficient in-memory computing for ML', c: 0 },
      { g: 'eemech', lab: 'DYNAMO / Digital Systems & Design Automation', pi: 'Lana Josipović', progs: ['D-ITET'], kw: 'ML for electronic design automation (EDA)', evi: '"Balor: HLS Source Code Evaluator…Hierarchical GNNs" — 1st place, ML Contest for Chip Design', c: 1 },
      { g: 'eemech', lab: 'Computer Vision Laboratory', pi: 'Ender Konukoglu', progs: ['D-ITET'], kw: 'ML for medical image computing / personalized medicine', evi: 'Stated pillar: "Medical image computing, machine learning, personalized medicine"', c: 1 },
      { g: 'eemech', lab: 'Institute for Biomedical Engineering', pi: 'Sebastian Kozerke', progs: ['D-ITET'], kw: 'Deep learning MRI reconstruction', evi: '"FlowMRI-Net" (2024/25, self-supervised DL 4D flow MRI recon)', c: 1 },
      { g: 'eemech', lab: 'Automatic Control Laboratory', pi: 'Lars Lindemann', progs: ['D-ITET'], kw: 'ML for verification & control, uncertainty quantification', evi: 'Stated pillar: "machine learning for verification and control, uncertainty quantification"', c: 1 },
      { g: 'eemech', lab: 'Automatic Control Laboratory', pi: 'John Lygeros', progs: ['D-ITET'], kw: 'ML-augmented control (learning-based MPC, RL for physiological control)', evi: 'Learning-based robust MPC for heat-pump frequency regulation; RL control for artificial pancreas', c: 0 },
      { g: 'eemech', lab: 'Institute of Neuroinformatics', pi: 'Valerio Mante', progs: ['D-ITET'], kw: 'Computational neuroscience / ML for neural circuit learning & cognition', evi: 'Stated pillar: "computational neuroscience, machine learning, data science"', c: 1 },
      { g: 'eemech', lab: 'SAFARI Research Group', pi: 'Onur Mutlu', progs: ['D-ITET'], kw: 'Hardware-accelerated deep-learning genomics', evi: '"RUBICON: A Framework for Designing Efficient Deep Learning-Based Genomic Basecallers" (Genome Biology, 2024)', c: 1 },
      { g: 'eemech', lab: 'Institute of Neuroinformatics', pi: 'Melika Payvand', progs: ['D-ITET'], kw: 'Neuromorphic electronic systems, NeuroAI, HW-algorithm co-design', evi: 'Stated pillar: "Neuromorphic Electronic Systems, NeuroAI, HW-Algorithm co-design"', c: 1 },
      { g: 'eemech', lab: 'Low-dimensional Quantum Electronics', pi: 'Mickaël Perrin', progs: ['D-ITET'], kw: 'ML applied to quantum electronic devices', evi: 'Stated pillar explicitly lists "machine learning" alongside quantum heat engines', c: 0 },
      { g: 'eemech', lab: 'Institute of Neuroinformatics (Neural Dynamics Lab)', pi: 'Timothée Proix', progs: ['D-ITET'], kw: 'ML/dynamical-systems models of neural language processing', evi: 'Theoretical models using dynamical systems and ML tools, fit to single-cell intracranial recordings', c: 1 },
      { g: 'eemech', lab: 'Institute for Biomedical Engineering', pi: 'Daniel Razansky', progs: ['D-ITET'], kw: 'Deep learning for optoacoustic / biomedical imaging', evi: '"Deep learning optoacoustic tomography with sparse data" (Nature Machine Intelligence, 2019)', c: 1 },
      { g: 'eemech', lab: 'Institute for Biomedical Engineering (X-ray Imaging)', pi: 'Marco Stampanoni', progs: ['D-ITET'], kw: 'ML/DL for tomographic reconstruction', evi: 'DL-regularized iterative tomography (deep neural network regularizers)', c: 1 },
      { g: 'eemech', lab: 'Integrated Systems Laboratory', pi: 'Christoph Studer', progs: ['D-ITET'], kw: 'ML for signal processing / communications hardware', evi: 'Stated pillar: "wireless communications, signal processing, machine learning"', c: 1 },
      { g: 'eemech', lab: 'Integrated Systems Laboratory', pi: 'Hua Wang', progs: ['D-ITET'], kw: 'ML-integrated RF / mm-Wave circuits, bioelectronics', evi: 'Stated pillar explicitly lists "machine learning" alongside circuits/bioelectronics', c: 1 },

      // ---- EE + MECH: D-MAVT ----
      { g: 'eemech', lab: 'Laboratory for Energy Conversion (LEC)', pi: 'Reza Abhari', progs: ['D-MAVT'], kw: 'AI/agent-based modeling of energy & urban systems', evi: 'Agent-based simulation using "artificial intelligence models" for pan-European energy/mobility data', c: 0 },
      { g: 'eemech', lab: 'Advanced Manufacturing', pi: 'Markus Bambach', progs: ['D-MAVT'], kw: 'ML surrogate models for additive manufacturing thermal processes', evi: 'GPyro; Harmonic-Mapping Operator geometry-agnostic ML surrogate', c: 1 },
      { g: 'eemech', lab: 'Energy and Process Systems Engineering (EPSE)', pi: 'André Bardow', progs: ['D-MAVT'], kw: 'ML for process/chemical systems engineering & LCA', evi: 'CRYSTAL framework (ML-generated life-cycle inventories via retrosynthesis)', c: 1 },
      { g: 'eemech', lab: 'Computational Mechanics Group', pi: 'Laura De Lorenzis', progs: ['D-MAVT'], kw: 'ML for computational solid mechanics (constitutive model discovery)', evi: 'Stated pillar: "machine learning for computational mechanics"; automated material-model discovery from data', c: 1 },
      { g: 'eemech', lab: 'Dynamic Systems and Control (IDSC)', pi: 'Emilio Frazzoli', progs: ['D-MAVT'], kw: 'Learning-based control for autonomous vehicles', evi: 'Learning-based NMPC (Gaussian Processes) for autonomous-vehicle dynamics prediction', c: 0 },
      { g: 'eemech', lab: 'Dynamic Systems and Control (IDSC)', pi: 'Raffaello D’Andrea', progs: ['D-MAVT'], kw: 'RL/ML for robotics and aerial systems', evi: 'RL control policies for humanoid robots; CyberRunner open-source ML robotics platform', c: 1 },
      { g: 'eemech', lab: 'IDEAL / AI in Engineering Design', pi: 'Mark Fuge', progs: ['D-MAVT'], kw: 'AI/ML for engineering design (generative/inverse design)', evi: 'Chair of "Artificial Intelligence in Engineering Design"', c: 1 },
      { g: 'eemech', lab: 'Materials Lab', pi: 'Dennis Kochmann', progs: ['D-MAVT'], kw: 'Deep-learning generative inverse design of metamaterials', evi: 'Property-VAE and video denoising-diffusion models for inverse-designed spinodoid/mechanical metamaterials', c: 1 },
      { g: 'eemech', lab: 'Soft Robotics Lab (SRL)', pi: 'Robert Katzschmann', progs: ['D-MAVT'], kw: 'RL/imitation learning for soft & bio-hybrid robot locomotion/manipulation', evi: 'Real-world RL, imitation learning, diffusion policies (SoFi soft robotic fish)', c: 1 },
      { g: 'eemech', lab: 'Multi-Scale Robotics Lab (MSRL)', pi: 'Bradley Nelson & Salvador Pané', progs: ['D-MAVT'], kw: 'Deep learning for microrobot swarm navigation / drug delivery', evi: '"Autonomous environment-adaptive microrobot swarm navigation enabled by deep learning…" (Nature Machine Intelligence)', c: 1 },
      { g: 'eemech', lab: 'Spatial AI Lab (MRL)', pi: 'Stefan Leutenegger', progs: ['D-MAVT'], kw: 'Spatial AI for autonomous drone/robot perception & navigation', evi: 'Lab explicitly named "Spatial AI"; deep-learning-based SLAM/perception for drones', c: 1 },
      { g: 'eemech', lab: 'Product Development Group Zurich (pd|z)', pi: 'Mirko Meboldt', progs: ['D-MAVT'], kw: 'ML-assisted design automation for biomedical product development', evi: 'Published on machine-learning-assisted design automation workflows', c: 0 },
      { g: 'eemech', lab: 'Computational Modeling of Materials in Manufacturing', pi: 'Dirk Mohr', progs: ['D-MAVT'], kw: 'ML/deep learning constitutive models for material mechanics', evi: 'Dedicated "Machine Learning – Artificial Intelligence in Mechanics and Manufacturing" research page', c: 1 },
      { g: 'eemech', lab: 'Reliability and Risk Engineering (RRE)', pi: 'Giovanni Sansavini', progs: ['D-MAVT'], kw: 'ML/deep RL for resilient energy-network optimization', evi: 'Physics-informed graph neural networks for security-constrained optimal power flow', c: 1 },
      { g: 'eemech', lab: 'Engineering Design and Computing Lab (EDAC)', pi: 'Kristina Shea', progs: ['D-MAVT'], kw: 'AI-driven generative design for engineering systems', evi: '"Deep Concept Identification for Generative Design" (2024)', c: 1 },
      { g: 'eemech', lab: 'Autonomous Systems Lab (ASL)', pi: 'Roland Siegwart', progs: ['D-MAVT'], kw: 'Deep learning for autonomous drone perception/control', evi: '"Deep Drone Racing: From Simulation to Reality with Domain Randomization" (2019)', c: 1 },
      { g: 'eemech', lab: 'Dynamic Systems and Control (IDSC)', pi: 'Melanie Zeilinger', progs: ['D-MAVT'], kw: 'Learning-based / ML-augmented control systems', evi: 'Stated pillar: "control systems and machine learning"', c: 1 },

      // ---- MTEC ----
      { g: 'mtec', lab: 'Decision Sciences and Analytics', pi: 'Tu Ni', progs: ['D-MTEC'], kw: 'Human-AI decision making, deep learning for operations', evi: 'Research on trust in human-AI decision loops, experimentation/analytics in operations', c: 1 },
      { g: 'mtec', lab: 'Chair of Production and Operations Management', pi: 'Torbjørn Netland', progs: ['D-MTEC'], kw: 'Explainable AI for smart / semiconductor manufacturing', evi: 'Published on XAI to improve process quality in semiconductor manufacturing', c: 1 },
      { g: 'mtec', lab: 'Chair of Strategic Management and Innovation / Strategy and AI Lab', pi: 'Georg von Krogh', progs: ['D-MTEC'], kw: 'AI’s impact on strategy, organization & innovation', evi: 'Most-cited guidepost essay on AI in organizations; SNSF grant on ML/genAI reshaping strategy-making; sailab.ethz.ch', c: 1 },
      { g: 'mtec', lab: 'Chair of Technology Marketing', pi: 'Florian von Wangenheim', progs: ['D-MTEC'], kw: 'AI / chatbots / robots in service & consumer engagement', evi: '"Demystifying AI: What Digital Transformation Leaders Can Teach You about Realistic AI" (2019)', c: 1 },
      { g: 'mtec', lab: 'Group for Sustainability and Technology', pi: 'Volker Hoffmann', progs: ['D-MTEC'], kw: 'ML meta-models for energy/climate policy optimization', evi: 'Stated plan to use ML meta-models for EV-transition policy optimization (forward-looking)', c: 0 },
      { g: 'mtec', lab: 'Chair of Logistics Management', pi: 'Stephan Wagner', progs: ['D-MTEC'], kw: 'AI-based supply-chain / humanitarian logistics planning', evi: 'AI planning tool deployed for ICRC medical-supply logistics, saved ~CHF 3.6M (2023)', c: 0 },

      // ---- GESS ----
      { g: 'gess', lab: 'Law, Economics, and Data Science Group', pi: 'Elliott Ash', progs: ['D-GESS'], kw: 'NLP/ML for legal & political text-as-data', evi: '"Text Algorithms in Economics"; Relatio narrative-extraction tool; Scientific Lead, Swiss AI Initiative', c: 1 },
      { g: 'gess', lab: 'Public Policy Group / Immigration Policy Lab', pi: 'Dominik Hangartner', progs: ['D-GESS'], kw: 'Causal ML for migration / refugee policy', evi: '"Optimal treatment allocation using policy trees" for naturalization; data-driven refugee integration assignment', c: 1 },
      { g: 'gess', lab: 'Computational Social Science', pi: 'Dirk Helbing', progs: ['D-GESS'], kw: 'ML/RL/federated AI for social systems', evi: 'Stated interests explicitly list machine learning, reinforcement learning, federated AI', c: 1 },
      { g: 'gess', lab: 'Law, Economics, and Business Group', pi: 'Alexander Stremitzer', progs: ['D-GESS'], kw: 'ML/AI applied to legal compliance & reasoning', evi: '"Machine Learning Compliance Analysis for Email Regulation"; "LEXam" legal reasoning benchmark (ICLR 2026)', c: 1 },
      { g: 'gess', lab: 'Center for Law & Economics', pi: 'Stefan Bechtold', progs: ['D-GESS'], kw: 'ML for trademark law, explainable AI, legal LLMs', evi: '"Automating Abercrombie: Machine-Learning Trademark Distinctiveness" (2024); "Lawma" legal LLM (ICLR 2025)', c: 1 },
      { g: 'gess', lab: 'Energy and Technology Policy Group', pi: 'Tobias Schmidt', progs: ['D-GESS'], kw: 'ML for clean-energy policymaking', evi: '"Policymaking for the clean energy transition…How can machine learning help?" (ICLR 2020)', c: 1 },
      { g: 'gess', lab: 'International Political Economy and Environmental Politics', pi: 'Lukas Fesenfeld', progs: ['D-GESS'], kw: 'ML + text analysis for climate/food policy feasibility', evi: 'Stated methods explicitly include machine learning alongside survey/field experiments', c: 1 },
      { g: 'gess', lab: 'Professorship for Research on Learning and Instruction', pi: 'Martina Rau', progs: ['D-GESS'], kw: 'AI in education, human-machine joint learning', evi: 'Stated interests include "artificial intelligence in education" and "joint learning of humans and machines"', c: 1 },
      { g: 'gess', lab: 'Social Brain Sciences Lab', pi: 'Emily Cross', progs: ['D-GESS'], kw: 'Human-AI interaction, adversarial AI, social robotics', evi: 'Stated interests explicitly include "adversarial AI" and "human-AI interaction" (ML more study-object than method)', c: 0 },
      { g: 'gess', lab: 'Social Networks Lab', pi: 'Christoph Stadtfeld', progs: ['D-GESS'], kw: 'Computational social science of network dynamics', evi: 'Dynamic network models integrating survey + social-media data (ML not explicitly named as method)', c: 0 },
      { g: 'gess', lab: 'Professorship for Learning Sciences and Higher Education', pi: 'Manu Kapur', progs: ['D-GESS'], kw: 'Adaptive/personalized learning, learning analytics', evi: 'Stated interests: "adaptive learning, personalized education, educational technology, and learning analytics"', c: 0 },
    ],
  },
];

export function getUniversities() {
  return UNIVERSITIES;
}
