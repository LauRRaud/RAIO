import * as migration_20260621_084547_initial_payload_schema from './20260621_084547_initial_payload_schema';
import * as migration_20260621_152759_orders_collection from './20260621_152759_orders_collection';
import * as migration_20260621_154824_admin_workflow_fields from './20260621_154824_admin_workflow_fields';
import * as migration_20260621_211020_page_images_global from './20260621_211020_page_images_global';
import * as migration_20260621_211609_trainings_and_event_modal_content from './20260621_211609_trainings_and_event_modal_content';
import * as migration_20260711_183641_page_editor_and_tool_cards from './20260711_183641_page_editor_and_tool_cards';
import * as migration_20260711_183834_expanded_page_editor_content from './20260711_183834_expanded_page_editor_content';

export const migrations = [
  {
    up: migration_20260621_084547_initial_payload_schema.up,
    down: migration_20260621_084547_initial_payload_schema.down,
    name: '20260621_084547_initial_payload_schema',
  },
  {
    up: migration_20260621_152759_orders_collection.up,
    down: migration_20260621_152759_orders_collection.down,
    name: '20260621_152759_orders_collection',
  },
  {
    up: migration_20260621_154824_admin_workflow_fields.up,
    down: migration_20260621_154824_admin_workflow_fields.down,
    name: '20260621_154824_admin_workflow_fields',
  },
  {
    up: migration_20260621_211020_page_images_global.up,
    down: migration_20260621_211020_page_images_global.down,
    name: '20260621_211020_page_images_global',
  },
  {
    up: migration_20260621_211609_trainings_and_event_modal_content.up,
    down: migration_20260621_211609_trainings_and_event_modal_content.down,
    name: '20260621_211609_trainings_and_event_modal_content',
  },
  {
    up: migration_20260711_183641_page_editor_and_tool_cards.up,
    down: migration_20260711_183641_page_editor_and_tool_cards.down,
    name: '20260711_183641_page_editor_and_tool_cards',
  },
  {
    up: migration_20260711_183834_expanded_page_editor_content.up,
    down: migration_20260711_183834_expanded_page_editor_content.down,
    name: '20260711_183834_expanded_page_editor_content'
  },
];
