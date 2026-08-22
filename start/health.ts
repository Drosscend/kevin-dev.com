import { HealthChecks, DiskSpaceCheck, MemoryHeapCheck } from '@adonisjs/core/health'
import { DbCheck } from '@adonisjs/lucid/database'
import db from '@adonisjs/lucid/services/db'

export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck(),
  new MemoryHeapCheck().warnWhenExceeds('400 mb').failWhenExceeds('500 mb'),
  new DbCheck(db.connection()),
])
