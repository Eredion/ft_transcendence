class WarAwaitJob < ApplicationJob
  queue_as :default

  def perform(war)
    (0..war.duration).each do |n|
      wartime = war.startdate + war.wartimehour.minutes + n.days
      #wartime = Time.now + n.days
      if (wartime < Time.now)
        WarTimeOnJob.perform_later(war)
      else
        WarTimeOnJob.set(wait_until: wartime).perform_later(war)
      end
      WarTimeOffJob.set(wait_until: wartime + 1.minutes).perform_later(war)
    end
    if (war.startdate == Date.today)
      WarStartJob.perform_later(war)
    else
      WarStartJob.set(wait_until: war.startdate).perform_later(war)
    end
    # Do something later
  end
end
