# Database Schema

## 1. User

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user', 'security'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  depotSite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DepotSite',
    default: null
  }
}, { timestamps: true });

// Pre-save hook: hash passwordHash with bcrypt genSalt(12)
userSchema.pre('save', async function (next) {
  // hash this.passwordHash with bcrypt, salt rounds = 12
  next();
});

// Methods
userSchema.methods.comparePassword = function (candidatePassword) {
  // compare candidatePassword with this.passwordHash using bcrypt.compare
};

userSchema.methods.toSafeJSON = function () {
  // return a JSON-safe representation omitting passwordHash
};
```

## 2. Request

```javascript
const requestEquipmentSchema = new mongoose.Schema({
  equipmentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentType',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const requestSchema = new mongoose.Schema({
  requestNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[A-Za-z0-9]{6}$/
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    default: null
  },
  supplier: {
    type: String,
    trim: true,
    default: ''
  },
  equipments: [requestEquipmentSchema],
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'dispatched'],
    default: 'pending'
  },
  pdfPath: {
    type: String,
    default: null
  },
  depotSite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DepotSite',
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fulfilledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  boxNumber: {
    type: String,
    trim: true,
    default: ''
  },
  bayNumber: {
    type: String,
    trim: true,
    default: ''
  },
  fulfillmentDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Index
requestSchema.index({ status: 1 });
```

## 3. Template

```javascript
const templateEquipmentSchema = new mongoose.Schema({
  equipmentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentType',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  supplier: {
    type: String,
    trim: true,
    default: ''
  },
  equipments: [templateEquipmentSchema]
}, { timestamps: true });

// Index
templateSchema.index({ name: 1, supplier: 1 });
```

## 4. EquipmentType

```javascript
const equipmentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });
```

## 5. DepotSite

```javascript
const depotSiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isFirstSite: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });
```

## 6. TrailerType

```javascript
const trailerEquipmentSchema = new mongoose.Schema({
  equipmentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentType',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const trailerTypeSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  equipments: [trailerEquipmentSchema]
}, { timestamps: true });
```

## 7. AppConfig

```javascript
const appConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { timestamps: true });
```
