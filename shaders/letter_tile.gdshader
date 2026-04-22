shader_type canvas_item;

uniform float progress : hint_range(0.0, 1.0) = 0.0;
uniform float border_width = 25.0;
uniform vec4 border_color : source_color = vec4(0.0, 1.0, 0.0, 1.0);

void fragment() {
    vec2 uv = UV;
    vec2 center = vec2(0.5, 0.5);

    vec2 dir = uv - center;

    float angle = atan(dir.y, dir.x);
    float normalized_angle = (angle + PI) / (2.0 * PI);

    float dist_to_edge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float border = step(dist_to_edge, border_width / 100.0);

    float mask = step(normalized_angle, 1.0 - progress);

    COLOR = vec4(border_color.rgb, border * mask);
}