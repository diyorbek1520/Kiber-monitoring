// Crypto moduli tahlil, tarix va hisobot yozuvlari uchun noyob id yaratish uchun ishlatiladi.
import crypto from 'node:crypto';

// JSON storage tahlil natijalarini faylda saqlash va o'qish uchun ishlatiladi.
import { readStore, updateStore } from '../storage/jsonStore.js';

export class Analysis {
  static async create(fields) {
    const now = new Date().toISOString();
    const record = {
      _id: crypto.randomUUID(),
      userId: String(fields.userId),
      turi: fields.turi,
      kirish: fields.kirish,
      natija: fields.natija,
      ball: fields.ball,
      xavfDarajasi: fields.xavfDarajasi,
      createdAt: now,
      updatedAt: now
    };

    await updateStore((store) => {
      store.analyses.push(record);
    });

    return record;
  }

  static find(filter = {}) {
    return new AnalysisQuery(filter);
  }

  static findOne(filter = {}) {
    return new AnalysisQuery(filter, true);
  }
}

class AnalysisQuery {
  constructor(filter, single = false) {
    this.filter = filter;
    this.single = single;
    this.sortSpec = null;
    this.limitCount = null;
  }

  sort(spec) {
    this.sortSpec = spec;
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  async lean() {
    const store = await readStore();
    let items = store.analyses.filter((item) => matchesAnalysis(item, this.filter));

    if (this.sortSpec?.createdAt) {
      const direction = this.sortSpec.createdAt;
      items = items.sort((a, b) => direction < 0
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (Number.isFinite(this.limitCount)) {
      items = items.slice(0, this.limitCount);
    }

    if (this.single) {
      return items[0] ? structuredClone(items[0]) : null;
    }

    return structuredClone(items);
  }
}

function matchesAnalysis(item, filter) {
  if (filter._id && item._id !== String(filter._id)) return false;
  if (filter.userId && item.userId !== String(filter.userId)) return false;
  return true;
}
