# 🏗️ FitLife Project Restructuring Plan

## 🎯 Objectives
1. Rename "fitlife" to "fitlife" 
2. Implement microservices-ready architecture
3. Organize files following best practices
4. Remove irrelevant/duplicate files
5. Prepare for horizontal scaling

---

## 📐 New Architecture: Microservices-Ready

```
fitlife/                          # Root directory (renamed from fitlife)
├── .github/                      # GitHub workflows (CI/CD)
├── docs/                         # All documentation
│   ├── API.md
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
├── services/                     # Microservices (independent services)
│   ├── nutri-ai-service/        # Nutrition analysis service
│   │   ├── api/                 # API routes
│   │   ├── core/                # Business logic
│   │   ├── models/              # Data models
│   │   ├── utils/               # Utilities
│   │   ├── config/              # Configuration
│   │   ├── tests/               # Unit tests
│   │   ├── requirements.txt
│   │   └── Dockerfile           # For containerization
│   │
│   ├── muscle-ai-service/       # Exercise analysis service
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   └── shared/                  # Shared utilities across services
│       ├── database/
│       ├── auth/
│       ├── middleware/
│       └── utils/
│
├── gateway/                      # API Gateway (main entry point)
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── app.py                   # Main Flask app
│   └── requirements.txt
│
├── web/                          # Frontend (static files & templates)
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   ├── images/
│   │   └── fonts/
│   ├── templates/
│   │   ├── base.html
│   │   ├── home.html
│   │   └── components/
│   └── assets/                  # Raw assets (before build)
│
├── data/                         # Data files & models
│   ├── ml-models/               # ML model files
│   ├── datasets/                # Training data
│   └── reference/               # Reference documents
│
├── scripts/                      # Utility scripts
│   ├── setup.py
│   ├── deploy.sh
│   └── migrate.py
│
├── tests/                        # Integration tests
│   ├── integration/
│   └── e2e/
│
├── docker/                       # Docker configurations
│   ├── docker-compose.yml
│   ├── .env.example
│   └── nginx/
│
├── .gitignore
├── README.md
├── requirements.txt              # Root dependencies
├── setup.py                      # Package setup
└── config.py                     # Global configuration
```

---

## 🔄 Migration Steps

### Phase 1: Create New Structure
1. Create new directory structure
2. Move files to appropriate locations
3. Update imports and references

### Phase 2: Rename Project
1. Rename fitlife → fitlife
2. Update all references
3. Update package names

### Phase 3: Cleanup
1. Remove duplicate files
2. Delete unused code
3. Consolidate configurations

### Phase 4: Update Documentation
1. Update all documentation
2. Create new guides
3. Update README

---

## 📦 Service Breakdown

### Nutri AI Service (Port 5001)
**Responsibilities:**
- OCR nutrition label extraction
- User profile management
- Health scoring algorithm
- RAG-based recommendations

**Dependencies:**
- EasyOCR
- FAISS
- GroqAI API

### Muscle AI Service (Port 5002)
**Responsibilities:**
- Video processing
- Pose detection (YOLO)
- Form analysis
- Rep counting

**Dependencies:**
- OpenCV
- PyTorch
- YOLO models

### API Gateway (Port 5000)
**Responsibilities:**
- Route requests to services
- Authentication
- Rate limiting
- Response aggregation

---

## 🗂️ File Mapping (Old → New)

### Root Level
```
fitlife/app.py                    → gateway/app.py
fitlife/__init__.py               → gateway/__init__.py
fitlife/requirements.txt          → gateway/requirements.txt
```

### Nutri AI
```
fitlife_data/                  → services/nutri-ai-service/
fitlife_data/app.py           → services/nutri-ai-service/api/routes.py
fitlife_data/ocr/             → services/nutri-ai-service/core/ocr/
fitlife_data/scoring/         → services/nutri-ai-service/core/scoring/
fitlife_data/retrieval/       → services/nutri-ai-service/core/retrieval/
fitlife_data/user_profile/    → services/nutri-ai-service/core/profile/
fitlife_data/data/            → data/nutri-ai/
fitlife_data/templates/       → web/templates/nutri-ai/
fitlife_data/static/          → web/static/ (merge)
```

### Muscle AI
```
muscle_ai/                       → services/muscle-ai-service/
muscle_ai/app/                  → services/muscle-ai-service/api/
muscle_ai/models/               → services/muscle-ai-service/core/models/
muscle_ai/main.py               → services/muscle-ai-service/api/routes.py
muscle_ai/app/templates/        → web/templates/muscle-ai/
muscle_ai/app/static/           → web/static/ (merge)
```

### Frontend
```
templates/                       → web/templates/
static/css/                     → web/static/css/
static/js/                      → web/static/js/
static/images/                  → web/static/images/
```

### Data & Models
```
fitlife_data/data/            → data/nutri-ai/
muscle_ai/models/*.pt           → data/ml-models/yolo/
```

---

## 🗑️ Files to Delete

### Duplicate/Unused Files
- `fitlife_data/interface/app.py` (duplicate)
- `fitlife_data/README.md` (consolidate)
- `__pycache__/` directories (all)
- `.pyc` files (all)
- Duplicate `requirements.txt` files

### Test Files (move to tests/)
- `fitlife_data/tests/`
- Individual test files

---

## 📝 Configuration Strategy

### Environment-Based Config
```
config/
├── base.py              # Base configuration
├── development.py       # Dev settings
├── production.py        # Prod settings
└── testing.py           # Test settings
```

### Service-Specific Config
```
services/nutri-ai-service/config/
├── __init__.py
├── settings.py
└── .env.example
```

---

## 🚀 Benefits of New Structure

### Scalability
✅ Each service can scale independently
✅ Easy to add new services
✅ Horizontal scaling ready

### Maintainability
✅ Clear separation of concerns
✅ Easy to locate files
✅ Modular architecture

### Deployment
✅ Docker-ready
✅ Kubernetes-ready
✅ Cloud-native architecture

### Development
✅ Services can be developed independently
✅ Clear boundaries
✅ Easy onboarding

---

## 🔧 Implementation Timeline

1. **Day 1-2**: Create structure, move files
2. **Day 3**: Update imports and references
3. **Day 4**: Test all functionality
4. **Day 5**: Documentation update

---

## ⚠️ Breaking Changes

### Import Statements
```python
# OLD
from fitlife_data.ocr import extract_nutrition_info

# NEW
from services.nutri_ai_service.core.ocr import extract_nutrition_info
```

### URL Routes
```python
# OLD
/health/profile

# NEW
/api/v1/nutri-ai/profile
```

---

## ✅ Success Criteria

- [ ] All files organized logically
- [ ] No duplicate code
- [ ] Services independent
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Ready for containerization

---

**Status**: Ready to Execute
**Estimated Time**: 4-6 hours
**Risk Level**: Medium (requires careful testing)
