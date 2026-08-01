#!/usr/bin/env python3
"""Content-lint: every beat id must exist in its referenced scene, and every drawn edge
must be a real scene edge. The valid id sets come from the app's published scene-ids.json
(the app is the authority on scene structure). Dependency-free; run in CI on every push.

Mirrors app/src/content/validate.ts — kept in sync via the shared scene-ids.json shape.
"""
import json
import sys
import urllib.request

SCENE_IDS_URL = (
    "https://raw.githubusercontent.com/schemabotview/graphl-flow/main/app/public/scene-ids.json"
)


def referenced_node_ids(delta):
    kind = delta["kind"]
    if kind in ("solidify", "pulse"):
        return delta["ids"]
    if kind == "annotate":
        return [delta["id"]]
    if kind == "pan":
        return [delta["to"]]
    if kind == "draw":
        return [nid for edge in delta["edges"] for nid in edge]
    return []


def main():
    with urllib.request.urlopen(SCENE_IDS_URL) as resp:
        scenes = json.load(resp)
    with open("manifest.json") as f:
        manifest = json.load(f)

    errors = []
    for si, section in enumerate(manifest["sections"], start=1):
        where = f'§{si} "{section["id"]}"'
        scene_id = section["scene"]
        scene = scenes.get(scene_id)
        if scene is None:
            errors.append(f'{where}: references unknown scene "{scene_id}"')
            continue
        nodes = set(scene["nodes"])
        edges = set(scene["edges"])
        for bi, beat in enumerate(section["beats"]):
            for delta in beat["delta"]:
                for nid in referenced_node_ids(delta):
                    if nid not in nodes:
                        errors.append(
                            f'{where} beat {bi}: {delta["kind"]} id "{nid}" is not a node in scene "{scene_id}"'
                        )
                if delta["kind"] == "draw":
                    for frm, to in delta["edges"]:
                        if f"{frm}->{to}" not in edges:
                            errors.append(
                                f'{where} beat {bi}: draw {frm}->{to} has no matching edge in scene "{scene_id}"'
                            )

    if errors:
        print(f"Content validation FAILED ({len(errors)}):")
        for e in errors:
            print(f"  ✗ {e}")
        sys.exit(1)
    print(f"✓ content valid — {len(manifest['sections'])} sections, all beat ids resolve to their scene")


if __name__ == "__main__":
    main()
