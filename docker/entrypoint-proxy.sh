#!/bin/sh
set -e
DATA_DIR="/app/docker-data"
mkdir -p "$DATA_DIR"
for f in \
  user_logs.json \
  folding_checkout_data.json \
  folding_checkout_detail.json \
  dryroom_hourly_data.json \
  shift_data.json \
  supervisor_data.json \
  sewing_layout_data.json \
  sewing_layout_post.json \
  line_production_targets.json \
  scanning_dryroom.json \
  dummy_cutting.json
do
  if [ ! -f "$DATA_DIR/$f" ]; then
    if [ -f "/app/$f" ]; then
      cp "/app/$f" "$DATA_DIR/$f"
    else
      echo '[]' > "$DATA_DIR/$f"
    fi
  fi
  ln -sf "$DATA_DIR/$f" "/app/$f"
done
exec "$@"
