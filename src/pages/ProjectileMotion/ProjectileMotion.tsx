import React, { useEffect } from 'react';
import styles from './ProjectileMotion.module.css';

const ProjectileMotion = () => {
    useEffect(() => {
        async function asyncExecute(){
            await import('./main');
        }
        asyncExecute();
    }, []);
    return (
        <React.Fragment>
            <form>
                <input type="text" className="velocity" placeholder="Enter the initial velocity (in m/s)" required />
                <input type="text" className="angle" placeholder="Enter the angle of projection (in degrees)" required />
                <label htmlFor="pixel_per_mt">Pixels per meter:</label>
                <div>
                    <input type="range" min="1" max="80" defaultValue="6" name="pixel_per_mt" className="pixel_per_mt" />
                    <span className="pixel_per_mt_value">6</span>
                </div>
                <label htmlFor="playback_speed">Playback Speed (in s):</label>
                <div>
                    <input type="range" min="0.25" max="2" step="0.25" defaultValue="1" name="playback_speed" className="playback_speed" />
                    <span className="playback_speed_value">1</span>
                </div>
                <div className="decimal_places">
                    <input type="checkbox" className="decimal_places_input" />
                    <label className="pixel_per_mt">truncate all decimal places</label>
                </div>
                <button type="submit" className="input_btn">Enter</button>
            </form>
            <br />
            <span className={styles.trajectory_title}>Trajectory:</span><br />
            <canvas></canvas>
            <div className={styles.wrapper}>
                <div className={styles.display}>
                    <div className={styles.variable}>
                        <span className="time"></span><br />
                        <span className="x_coordinate"></span><br />
                        <span className="y_coordinate"></span><br />
                        <span className="v_y"></span><br />
                    </div>
                    <div className="calculations">
                        <span className="gravity"></span><br /><br />
                        <span className="horizontal_velocity"></span><br /><br />
                        <span className="vertical_velocity"></span><br /><br />
                        <span className="time_of_flight"></span><br /><br />
                        <span className="range"></span><br /><br />
                        <span className="height"></span><br /><br />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ProjectileMotion;