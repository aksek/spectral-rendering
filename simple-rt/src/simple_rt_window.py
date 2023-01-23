import math
import moderngl
import pyrr
import time as t

from base_window import BaseWindowConfig


class SimpleRTWindow(BaseWindowConfig):

    def __init__(self, **kwargs):
        super(SimpleRTWindow, self).__init__(**kwargs)
        self.obj_model = self.load_scene(self.model_path)
        self.vao_sphere = self.obj_model.root_nodes[0].mesh.vao.instance(self.program)
        self.camera_location = (0.0, 1.0, -4.0)
        self.camera_rotation_x = (1.0, 0.0, 0.0)
        self.camera_rotation_y = (0.0, 1.0, 0.0)
        self.camera_rotation_z = (0.0, 0.0, 1.0)
        self.camera_velocity = 0.5

    def init_shaders_variables(self):
        self.res_location = self.program['res']
        self.camera_position_location = self.program['cameraPosition']
        self.camera_rotation_location = self.program['cameraRotation']
    
    def key_event(self, key, action, modifiers):
        if action == self.wnd.keys.ACTION_PRESS:

            if key == self.wnd.keys.D:
                self.update_camera_location(0, 1)
            elif key == self.wnd.keys.A:
                self.update_camera_location(0, -1)
            elif key == self.wnd.keys.W:
                self.update_camera_location(1, 1)
            elif key == self.wnd.keys.S:
                self.update_camera_location(1, -1)
            elif key == self.wnd.keys.R:
                self.update_camera_location(2, 1)
            elif key == self.wnd.keys.F:
                self.update_camera_location(2, -1)

            # elif key == self.wnd.keys.X:
            #     self.update_camera_rotation_x(0, -1)
            #     self.update_camera_rotation_x(2, 1)
            #     self.update_camera_rotation_z(0, -1)
            #     self.update_camera_rotation_z(2, -1)
            # elif key == self.wnd.keys.Z:
            #     self.update_camera_rotation_x(0, 1)
            #     self.update_camera_rotation_x(2, -1)
            #     self.update_camera_rotation_z(0, 1)
            #     self.update_camera_rotation_z(2, 1)

            self.render(0, 0)
    
    def update_camera_location(self, axis, direction):
        current_value = self.camera_location[axis]
        current_value += direction * self.camera_velocity
        if axis == 0:
            self.camera_location = (current_value, self.camera_location[1], self.camera_location[2])
        if axis == 1:
            self.camera_location = (self.camera_location[0], current_value, self.camera_location[2])
        if axis == 2:
            self.camera_location = (self.camera_location[0], self.camera_location[1], current_value)
    
    def update_camera_rotation_x(self, axis, direction):
        current_value = self.camera_rotation_x[axis]
        current_value += direction * self.camera_velocity
        if axis == 0:
            self.camera_rotation_x = (current_value, self.camera_rotation_x[1], self.camera_rotation_x[2])
        if axis == 1:
            self.camera_rotation_x = (self.camera_rotation_x[0], current_value, self.camera_rotation_x[2])
        if axis == 2:
            self.camera_rotation_x = (self.camera_rotation_x[0], self.camera_rotation_x[1], current_value)
    
    def update_camera_rotation_y(self, axis, direction):
        current_value = self.camera_rotation_y[axis]
        current_value += direction * self.camera_velocity
        if axis == 0:
            self.camera_rotation_y = (current_value, self.camera_rotation_y[1], self.camera_rotation_y[2])
        if axis == 1:
            self.camera_rotation_y = (self.camera_rotation_y[0], current_value, self.camera_rotation_y[2])
        if axis == 2:
            self.camera_rotation_y = (self.camera_rotation_y[0], self.camera_rotation_y[1], current_value)

    def update_camera_rotation_z(self, axis, direction):
        current_value = self.camera_rotation_z[axis]
        current_value += direction * self.camera_velocity
        if axis == 0:
            self.camera_rotation_z = (current_value, self.camera_rotation_z[1], self.camera_rotation_z[2])
        if axis == 1:
            self.camera_rotation_z = (self.camera_rotation_z[0], current_value, self.camera_rotation_z[2])
        if axis == 2:
            self.camera_rotation_z = (self.camera_rotation_z[0], self.camera_rotation_z[1], current_value)

    def unicode_char_entered(self, char: str):
        print('character entered:', char)

    def render(self, time: float, frame_time: float):
        self.ctx.clear(0.8, 0.8, 0.8, 0.0)
        self.ctx.enable(moderngl.DEPTH_TEST | moderngl.CULL_FACE)

        self.res_location.write(pyrr.Vector3((self.window_size[0], self.window_size[1], 0), dtype='f4'))
        self.camera_position_location.write(pyrr.Vector3(self.camera_location, dtype='f4'))
        self.camera_rotation_location.write(pyrr.Matrix33((
            self.camera_rotation_x,
            self.camera_rotation_y,
            self.camera_rotation_z
        ), dtype='f4'))

        self.vao_sphere.render()