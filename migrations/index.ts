import * as migration_20260621_084547_initial_payload_schema from './20260621_084547_initial_payload_schema';
import * as migration_20260621_152759_orders_collection from './20260621_152759_orders_collection';

export const migrations = [
  {
    up: migration_20260621_084547_initial_payload_schema.up,
    down: migration_20260621_084547_initial_payload_schema.down,
    name: '20260621_084547_initial_payload_schema',
  },
  {
    up: migration_20260621_152759_orders_collection.up,
    down: migration_20260621_152759_orders_collection.down,
    name: '20260621_152759_orders_collection'
  },
];
